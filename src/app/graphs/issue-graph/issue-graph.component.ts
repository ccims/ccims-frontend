import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DraggedEdge, Edge, Point} from '@ustutt/grapheditor-webcomponent/lib/edge';
import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor';
import {Node} from '@ustutt/grapheditor-webcomponent/lib/node';
import {Rect} from '@ustutt/grapheditor-webcomponent/lib/util';
import {BehaviorSubject, ReplaySubject, Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {IssueGraphStateService} from '../../data/issue-graph/issue-graph-state.service';
import {IssueGroupContainerBehaviour, IssueGroupContainerParentBehaviour} from './group-behaviours';
import {CreateInterfaceDialogComponent} from '@app/dialogs/create-interface-dialog/create-interface-dialog.component';
import {StateService} from '@app/state.service';
import {CreateInterfaceData} from '../../dialogs/create-interface-dialog/create-interface-dialog.component';
import {GraphData} from '../../data/issue-graph/graph-data';
import {IssueCategory} from 'src/generated/graphql';
import * as issueGraphNodes from './issue-graph-nodes';
import {ActivatedRoute, Router} from '@angular/router';
import {CreateComponentDialogComponent} from '@app/dialogs/create-component-dialog/create-component-dialog.component';
import {ComponentStoreService} from '@app/data/component/component-store.service';
import {InterfaceStoreService} from '@app/data/interface/interface-store.service';
import * as componentContextMenuComponent from '@app/graphs/component-context-menu/component-context-menu.component';
import {NodeDetailsType} from '@app/node-details/node-details.component';
import {doGraphLayout, LayoutNode} from '@app/graphs/automatic-layout';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { IssueGraphClassSettersService } from './class-setters/issue-graph-class-setters.service';
import { IssueGraphLinkHandlesService } from './link-handles/issue-graph-link-handles.service';
import { IssueGraphDynamicTemplateRegistryService } from './dynamic-template-registry/issue-graph-dynamic-template-registry.service';

interface Positions {
  nodes: { [prop: string]: Point; };
  issueGroups: { [node: string]: string };
}

/**
 * This component creates nodes and edges in the embedded MICO GraphEditor
 * (html tag: <network-graph>) to reflect the data for the current project.
 * This data consists of the project's interfaces, components, issues and their relations and
 * is stored in this.graphData. The key method for this purpose is drawGraph().
 * This component is also responsible for registering event listeners with the GraphEditor.
 */
@Component({
  selector: 'app-issue-graph',
  templateUrl: './issue-graph.component.html',
  styleUrls: ['./issue-graph.component.css'],
})
export class IssueGraphComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private dialog: MatDialog,
              private gs: IssueGraphStateService,
              private ss: StateService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private componentStoreService: ComponentStoreService,
              private interfaceStoreService: InterfaceStoreService,
              private componentContextMenuService: componentContextMenuComponent.ComponentContextMenuService,
              private breakPointObserver: BreakpointObserver,
              private issueGraphClassSettersService: IssueGraphClassSettersService,
              private issueGraphLinkHandlesService: IssueGraphLinkHandlesService,
              private issueGraphDynamicTemplateRegistryService: IssueGraphDynamicTemplateRegistryService) {
  }

  // references the graph template
  @ViewChild('graph', {static: true}) graphWrapper: { nativeElement: GraphEditor; };

  // references the minimap template
  @ViewChild('minimap', {static: true}) minimap: { nativeElement: GraphEditor; };

  currentVisibleArea: Rect = {x: 0, y: 0, width: 1, height: 1};
  @Input() projectId: string;

  readonly zeroPosition = {x: 0, y: 0};

  // ?
  private componentActionsOverlay: componentContextMenuComponent.ComponentContextMenuComponent;

  // ?
  private componentActionsOverlayId: number | string;



  // ?
  private destroy$ = new ReplaySubject(1);



  // reference to the GraphEditor instance of the graph
  private graph: GraphEditor;

  // contains all data about the projects interfaces, components, issues and their relations
  // that is needed in order to create nodes and edges in the grapheditor to visualize the project
  public graphData: GraphData;

  // ?
  private graphFirstRender = true;

  // indicates whether graph is initialized
  private graphInitialized = false;



  // ?
  private isHandset = false;

  // contains nodes representing interfaces and components which utilize node groups for display of issue folders
  private issueGroupParents: Node[] = [];
  


  // local storage key for positions of graph elements
  private projectStorageKey: string;



  // The component details page moves the graph sometimes a bit,
  // so dont move back when closing the component details page
  private redrawByCloseOfComponentDetails = false;

  // when a new graph state arrives it is passed to the graph
  // and a graph redraw is issued
  // (check IssueGraphControlsComponents ngAfterViewInit for more information) 
  public reload$: BehaviorSubject<void> = new BehaviorSubject(null);

  // ?
  private reloadOnMouseUp = false;



  // ?
  private savedPositions: Positions = {nodes: {}, issueGroups: {}};

  // ?
  private savePositionsSubject = new Subject<null>();



  // used in the drawGraph method true on first draw and after component creation, effects a zoom to bounding box
  private zoomOnRedraw = true;



  // ...



  /**
   * Gets reference to the MICO GraphEditor instance of the graph and initializes it.
   */
  ngAfterViewInit(): void {
    this.graph = this.graphWrapper.nativeElement;
    this.initGraph();
  }

  /**
   * Sets up a local storage key for graph element positions.
   */
  ngOnInit() {
    this.projectStorageKey = `CCIMS-Project_${this.projectId}`;
    this.breakPointObserver.observe(Breakpoints.Handset)
      .subscribe(r => this.isHandset = r.matches);
  }

  /**
   * Cancels all subscriptions on component destruction.
   */
  ngOnDestroy() {

    // saves the current zoom details of the graph for when the user comes back to the graph
    localStorage.setItem(`zoomTransform_${this.projectStorageKey}`, 
      JSON.stringify(this.graph.currentZoomTransform));

    // saves the current bounding box of the graph for when the user comes back to the graph
    localStorage.setItem(`zoomBoundingBox_${this.projectStorageKey}`, 
      JSON.stringify(this.graph.currentViewWindow));

    this.destroy$.next();
    this.closeComponentActions();
  }



  // initGraph



  /**
   * 1) Sets up a subscription for node positions
   * 2) and initializes the graph.
   * Also manages:
   * 3) class setters with the graph editor
   * that apply css classes based on the edge and node types,
   * 4) the link handle calculation,
   * 5) the edge drag behaviour,
   * 6) the dynamic template registry.
   * 7) and various event listeners on the graph.
   */
  initGraph() {

    // case: graph already initialized
    if (this.graphInitialized) {
      return;
    }

    // loads saved positions
    this.savedPositions = this.loadSavedPositions();

    // 1) subscribes to the subject emitting node positions
    this.subscribeToSubject();
    
    // 2) initializes the graph
    this.graphInitialized = true;

    // references to the GraphEditor instance of the graph / minimap
    const graph: GraphEditor = this.graphWrapper.nativeElement;
    const minimap: GraphEditor = this.minimap.nativeElement;

    // 3) manages the node / edge class setters
    this.issueGraphClassSettersService.manageClassSetters(graph, minimap);

    // 4) manages the edge link handles
    this.issueGraphLinkHandlesService.manageLinkHandles(graph, minimap);

    // 5) manages the edge drag behaviour
    this.manageDragBehaviour(graph);

    // 6) manages the dynamic template registry
    this.issueGraphDynamicTemplateRegistryService.manageDynamicTemplateRegistry(graph);

    // 7) manages the event listeners
    this.manageEventListeners(graph, minimap);
  }

  /**
    * Loads positions of graph elements from the local storage.
    * @returns Parsed positions
    */
  private loadSavedPositions(): Positions {

    // gets data from the local storage
    const data = localStorage.getItem(this.projectStorageKey);

    // case: there is no data
    if (data == null) {
      return {nodes: {}, issueGroups: {}};
    }

    return JSON.parse(data);
  }

  /**
   * Subscribes to the subject emitting node positions.
   */
  private subscribeToSubject() {
    this.savePositionsSubject
      .pipe(takeUntil(this.destroy$), debounceTime(300))
      .subscribe(() => {
        console.log('Setting: ', this.projectStorageKey);

        // case: there are saved positions
        if (this.savedPositions != null) {
          const newData = JSON.stringify(this.savedPositions);
          localStorage.setItem(this.projectStorageKey, newData);
        }
      });
  }

  /**
   * Manages the edge drag behaviour of given GraphEditor instance.
   * @param  {GraphEditor} graph - Reference to the GraphEditor instance of the graph that is handled.
   */
  private manageDragBehaviour(graph: GraphEditor) {

    // applies functionality for when an edge is created
    graph.onCreateDraggedEdge = this.onCreateEdge;
    
    // applies functionality for when an edge is dragged (and its target is changed)
    graph.onDraggedEdgeTargetChange = this.onDraggedEdgeTargetChanged;
    
    // applies functionality for when an edge is added
    graph.addEventListener('edgeadd', this.onEdgeAdd);
    
    // applies functionality for when an edge is removed
    graph.addEventListener('edgeremove', this.onEdgeRemove);
    
    // applies functionality for when an edge is dropped
    graph.addEventListener('edgedrop', this.onEdgeDrop);
  }

  /**
   * Method gets triggered after an edge gets created,
   * it can either be of type provider or consumer.
   * @param  {DraggedEdge} edge - Edge that is handled.
   */
  private onCreateEdge = (edge: DraggedEdge) => {

    const graph: GraphEditor = this.graphWrapper.nativeElement;
    const sourceNode = graph.getNode(edge.source);

    // case: edge created from an existing edge
    // => allows deletion or dropping at the same node
    if (edge.createdFrom != null) {
      const original = graph.getEdge(edge.createdFrom);
      edge.validTargets.clear();
      edge.validTargets.add(original.target.toString());
      return edge;
    }

    // case: edge originates from a component
    if (sourceNode.type === issueGraphNodes.NodeType.Component) {

      // updates edge properties (no drag handles)
      edge.type = issueGraphNodes.NodeType.Interface;
      edge.dragHandles = [];

      // updates valid targets
      edge.validTargets.clear();
      
      // updates marker at the end of the edge
      edge.markerEnd = {
        template: "interface-connector-initial",
        relativeRotation: 0,
        absoluteRotation: 0
      };
      
      // allows only interfaces as targets
      graph.nodeList.forEach((node) => {
        if (node.type === issueGraphNodes.NodeType.Interface) {
          edge.validTargets.add(node.id.toString());
        }
      });

      // allows only new targets
      graph.getEdgesBySource(sourceNode.id).forEach((existingEdge) => {
        edge.validTargets.delete(existingEdge.target.toString());
      });
    }
    
    return edge;
  }
  
  /**
   * Method gets triggered after an edge gets dragged
   * and its target is changed:
   * ex. consumer edge gets moved away from the provider edge.
   * @param  {DraggedEdge} edge - Edge that is handled.
   * @param  {Node} sourceNode - Source of the handled edge.
   * @param  {Node} targetNode - Target of the handled edge.
   * @returns {DraggedEdge} Edge that is handled.
   */
  private onDraggedEdgeTargetChanged = (
    edge: DraggedEdge,
    sourceNode: Node,
    targetNode: Node
  ) => {

    // case: edge originates from a component
    if (sourceNode.type === issueGraphNodes.NodeType.Component) {

      // case: target of edge is an interface
      // => handles edge as of type consumer
      if (targetNode?.type === issueGraphNodes.NodeType.Interface) {

        // updates edge properties (default drag handle)
        edge.type = issueGraphNodes.NodeType.InterfaceConsumer;
        delete edge.dragHandles;

        // updates marker at the end of the edge
        edge.markerEnd = {
          template: issueGraphNodes.NodeType.InterfaceConsumer,
          relativeRotation: 0,
        };
      }
      
      // case: target of edge is not an interface (aka. null)
      // => handles edge as of type provider
      else {

        // updates edge properties (no drag handles)
        edge.type = issueGraphNodes.NodeType.Interface;
        edge.dragHandles = [];

        // updates marker at the end of the edge
        // ? delete edge.markerEnd; ?
        edge.markerEnd = {
          template: "interface-connector-initial",
          relativeRotation: 0,
          absoluteRotation: 0
        };
      }
    }

    return edge;
  }

  /**
   * Method gets triggered after an edge gets added.
   * @param  {CustomEvent} event - Event that is handled.
   */
  private onEdgeAdd = (event: CustomEvent) => {

    const edge: Edge = event.detail.edge;

    // case: source of event is the API
    if (event.detail.eventSource === 'API') {
      return;
    }

    // case: edge of type interface consumer
    if (edge.type === issueGraphNodes.NodeType.InterfaceConsumer) {

      // cancels edge creation
      event.preventDefault();

      // updates the graph via the API
      const sourceNode = this.graph.getNode(edge.source);
      const targetNode = this.graph.getNode(edge.target);

      // case: edge has source and target
      // => adds edge of type interface provider
      if (sourceNode != null && targetNode != null) {
        this.gs.addConsumedInterface(sourceNode.id.toString(), targetNode.id.toString()).subscribe(() => this.reload$.next(null));
      }
    }
  }

  /**
   * Method gets triggered after an edge gets dropped.
   * @param  {CustomEvent} event - Event that is handled.
   */
  private onEdgeDrop = (event: CustomEvent) => {

    const edge: DraggedEdge = event.detail.edge;

    // case: source of event is the API
    if (event.detail.eventSource === 'API') {
      return;
    }
    
    // case: edge created from an existing edge
    if (edge.createdFrom != null) {
      return;
    }

    // case: edge of type interface
    // => opens the interface creation dialog
    if (edge.type === issueGraphNodes.NodeType.Interface) {
      this.addInterfaceToComponent(event.detail.sourceNode.id, event.detail.dropPosition);
    }
  }

  /**
   * Opens the interface creation dialog. If the user actually creates the interface 
   * it is added to the providing component at the posititon
   * where the dragegd edge was dropped by the user (before opening the interface creation dialog).
   * @param offeredById - Id of the comonent that will provide the interface.
   * @param position - Position of the interface.
   */
  private addInterfaceToComponent(offeredById: string, position: issueGraphNodes.Position) {

    // interface data
    const data: CreateInterfaceData = {
      position,
      offeredById
    };

    // interface dialog reference
    const createInterfaceDialogRef = this.dialog.open(CreateInterfaceDialogComponent, {
      data
    });

    // subscribes ...
    createInterfaceDialogRef.afterClosed().subscribe((interfaceId) => {
      this.savedPositions.nodes[interfaceId] = {
        x: position.x,
        y: position.y
      };
      this.savePositionsSubject.next();
      this.reload$.next(null);
    });
  }

  /**
   * Method gets triggered after an edge gets removed.
   * @param  {CustomEvent} event - Event that is handled.
   */
  private onEdgeRemove = (event: CustomEvent) => {

    const edge: Edge = event.detail.edge;

    // case: source of event is the API
    if (event.detail.eventSource === 'API') {
      return;
    }

    // case: edge of type interface consumer
    if (edge.type === issueGraphNodes.NodeType.InterfaceConsumer) {

      // cancels edge deletion
      event.preventDefault();

      // updates the graph via the API
      const graph: GraphEditor = this.graphWrapper.nativeElement;
      const sourceNode = graph.getNode(edge.source);
      const targetNode = graph.getNode(edge.target);

      // case: edge has source and target
      // => removes edge of type interface provider
      if (sourceNode != null && targetNode != null) {
        this.gs.removeConsumedInterface(sourceNode.id.toString(), targetNode.id.toString()).subscribe(() => this.reload$.next(null));
      }
    }
  }

  /**
   * Adds event listeners to a given GraphEditor instance.
   * @param  {GraphEditor} graph - Reference to the GraphEditor instance of the graph that is handled.
   * @param  {GraphEditor} minimap - Reference to the GraphEditor instance of the minimap that is handled.
   */
  private manageEventListeners(graph: GraphEditor, minimap: GraphEditor) {

    // applies functionality for when a node is clicked
    graph.addEventListener('nodeclick', this.onNodeClick);

    // applies functionality for when the position of a node is changed
    graph.addEventListener('nodepositionchange', (e: CustomEvent) => {
      if (this.closeComponentActions(false)) {
        this.reloadOnMouseUp = true;
      }
    });

    // ?
    // TODO: document and extract
    graph.addEventListener('nodedragend', (event: CustomEvent) => {
      const node = event.detail.node;
      if (node.type === issueGraphNodes.NodeType.IssueGroupContainer) {
        this.savedPositions.issueGroups[node.id] = node.position;
      }

      // store node positioning information
      this.savedPositions.nodes[node.id] = {
        x: node.x,
        y: node.y,
      };
      this.savePositionsSubject.next();
      if (this.reloadOnMouseUp) {
        this.reloadOnMouseUp = false;
        this.zoomOnRedraw = false;
        this.reload();
      }
    });

    // applies functionality for when a node is added to the minimap
    graph.addEventListener('nodeadd', (event: CustomEvent) => {
      if (event.detail.node.type === issueGraphNodes.NodeType.IssueGroupContainer) {
        return;
      }
      const node = event.detail.node;
      minimap.addNode(node);
    });

    // applies functionality for when a node is removed from the minimap
    graph.addEventListener('noderemove', (event: CustomEvent) => {
      const node = event.detail.node;
      if (event.detail.node.type !== issueGraphNodes.NodeType.IssueGroupContainer) {
        minimap.removeNode(node);
      }
    });

    // applies functionality for when an edge is added to the minimap
    graph.addEventListener('edgeadd', (event: CustomEvent) => {
      minimap.addEdge(event.detail.edge);
    });

    // applies functionality for when an edge is removed from the minimap
    graph.addEventListener('edgeremove', (event: CustomEvent) => {
      minimap.removeEdge(event.detail.edge);
    });

    // applies functionality for when the minimap is rendered
    graph.addEventListener('render', this.onMinimapRender(minimap));

    // ?
    graph.addEventListener('click', (e) => this.closeComponentActions());

    // applies functionality for when the zoom is changed
    graph.addEventListener('zoomchange', (event: CustomEvent) => {
      this.currentVisibleArea = event.detail.currentViewWindow;
      if (!this.componentActionsOverlay) {
        return;
      }

      const node = this.graph.getNode(this.componentActionsOverlayId);
      const [x, y] = this.graph.currentZoomTransform.apply([node.x, node.y]);
      this.componentActionsOverlay.updatePosition(Math.max(x, 0), Math.max(y, 0));
    });
  }

  /**
   * Method gets triggered after a node is clicked.
   * @param  {CustomEvent} event - Event that is handled.
   */
  private onNodeClick = (event: CustomEvent) => {

    // cancels node selection
    event.preventDefault();

    const node: Node = event.detail.node;

    if (this.componentActionsOverlay && this.componentActionsOverlay.data.nodeId === node.id) {
      this.closeComponentActions();
      return;
    }

    this.closeComponentActions();

    // doesn't allow the view of the graph to change after the Details page has been closed
    this.redrawByCloseOfComponentDetails = true;

    let contextMenuType: NodeDetailsType = null;

    if (event.detail.sourceEvent.shiftKey || this.isHandset) {

      // case: node of type Component
      // => opens View Component page
      if (node.type === issueGraphNodes.NodeType.Component) {
        this.router.navigate(['./component/', node.id], {relativeTo: this.activatedRoute.parent});
        return;
      }

      // case: node of type Interface
      // => opens View Interface page
      if (node.type === issueGraphNodes.NodeType.Interface) {
        this.router.navigate(['./interface/', node.id], {relativeTo: this.activatedRoute.parent});
        return;
      }
    } else {

      // sets the context menu type
      contextMenuType = this.nodeClickSetContextMenuType(node, contextMenuType);

      // case: context menu has a type
      // => handles zooming
      if (contextMenuType != null) {
        this.NodeClickContextMenuHasType(node, event, contextMenuType);
        return;
      }
    }

    // case: clicked issue folder
    // => determines issue count, opens corresponding issue page
    this.nodeClickIssueFolder(node);
  }

  /**
   * Sets the context menu type.
   * @param  {Node} node - Node that is handled.
   * @param  {NodeDetailsType} contextMenuType Type of the context menu that is handled.
   */
  private nodeClickSetContextMenuType(node: Node, contextMenuType: NodeDetailsType) {
    
    // case: node of type Component
    // => sets the context menu type as Component
    if (node.type === issueGraphNodes.NodeType.Component) {
      contextMenuType = NodeDetailsType.Component;
    }

    // case: node of type Interface
    // => sets the context menu type as Interface
    if (node.type === issueGraphNodes.NodeType.Interface) {
      contextMenuType = NodeDetailsType.Interface;
    }

    return contextMenuType;
  }

  /**
   * Handles zooming of the graph
   * aka. case in which the context menu has a type.
   * @param  {Node} node - Node that is handled.
   * @param  {CustomEvent<any>} event - Event that is handled.
   * @param  {NodeDetailsType} contextMenuType - Type of the context menu that is handled.
   */
  private NodeClickContextMenuHasType(node: Node, event: CustomEvent<any>, contextMenuType: NodeDetailsType) {

    // current zoom transform of the graph
    const [x, y] = this.graph.currentZoomTransform.apply([node.x, node.y]);

    // case: zoomed
    if (x >= 0 && y >= 0) {
      this.componentActionsOverlayId = node.id;

      // cancels click event that would otherwise close it again
      event.detail.sourceEvent.stopImmediatePropagation();

      this.componentActionsOverlay =
        this.componentContextMenuService.open(
          this.graphWrapper.nativeElement,
          x,
          y,
          this.projectId,
          node.id.toString(),
          contextMenuType,
          this);

      // makes sure the context menu is visible if it extends over the right / bottom edge
      const visible = this.graph.currentViewWindow;
      const scale = this.graph.currentZoomTransform.k;
      // FIXME: this isn't ideal, as the padding is somewhat dependent on the aspect ratio
      const padding = 85 / scale;
      const edgeX = visible.width * scale;
      const edgeY = visible.height * scale;
      const moveX = Math.max(0, this.componentActionsOverlay.width + x - edgeX) / scale;
      const moveY = Math.max(0, this.componentActionsOverlay.height + y - edgeY) / scale;

      // case: zooming
      if (moveX || moveY) {
        this.graph.zoomToBox({
          x: visible.x + moveX + padding, y: visible.y + moveY + padding,
          width: visible.width - 2 * padding, height: visible.height - 2 * padding
        });
      }
    }
  }

  /**
   * Handles the case in which an issue folder is clicked.
   * Determines the number of issues in the issue folder
   * and opens the corresponding issue page.
   * @param  {Node} node - Issue folder that is handled.
   */
  private nodeClickIssueFolder(node: Node) {

    // case: clicked issue folder
    // => determines issue count, opens corresponding issue page
    if (node.type === 'BUG' || node.type === 'UNCLASSIFIED' || node.type === 'FEATURE_REQUEST') {

      // reference to the GraphEditor instance of the graph, the root ID and the root node
      const graph: GraphEditor = this.graphWrapper.nativeElement;
      const rootId = graph.groupingManager.getTreeRootOf(node.id);
      const rootNode = graph.getNode(rootId);

      // case: only one issue inside the clicked issue folder
      // => opens Issue Details page
      if (node.issueCount == 1) {
        this.nodeClickOneIssue(rootId, rootNode, node);
        return;
      }

      // case: many issues inside the clicked issue folder
      // => opens Component Issues / Interface Issues page
      else {
        this.nodeClickManyIssues(rootNode);
        return;
      }
    }
  }

  /**
   * Handles the case in which the clicked issue folder contains only one issues.
   * @param  {Node} rootNode - Root node that is handled.
   * @param  {string} rootId - Root id that is handled.
   * @param  {Node} node - Clicked node that is handled.
   */
  private nodeClickOneIssue(rootId: string, rootNode: Node, node: Node) {

    // case: root node of type Component
    // => handles a single component issue, opens its Issue Details page
    if (rootNode.type === issueGraphNodes.NodeType.Component) {
      this.componentStoreService.getFullComponent(rootId).subscribe(component => {
        const currentIssueId = this.extractIssueId(component.node.issues.nodes, node.type);
        this.router.navigate(['./', 'issues', currentIssueId], { relativeTo: this.activatedRoute.parent });
      });
    } 
    
    // case: root node of type Interface
    // => handles a single interface issue, opens its Issue Details page
    else if (rootNode.type === issueGraphNodes.NodeType.Interface) {
      this.interfaceStoreService.getInterface(rootId).subscribe(interfaceComponent => {
        const currentIssueId = this.extractIssueId(interfaceComponent.node.issuesOnLocation.nodes, node.type);
        this.router.navigate(['./', 'issues', currentIssueId], { relativeTo: this.activatedRoute.parent });
      });
    }
  }

  /**
   * Extracts the id of an issue in a given issue list.
   * @param issueList - Ids of the issues that are handled.
   * @param category - Category of issues that are handled.
   * @returns Id of the first issue (in the issue list) with matching category.
   */
  private extractIssueId(issueList, category: string): string {
    for (const issue of issueList) {
      if (issue.category === category) {
        return issue.id;
      }
    }
  }

  /**
   * Handles the case in which the clicked issue folder contains many issues.
   * @param  {Node} rootNode - Root node that is handled.
   */
  private nodeClickManyIssues(rootNode: Node) {

    // case: root node of type Component
    // => handles many component issues, opens their Component Issues page
    if (rootNode.type === issueGraphNodes.NodeType.Component) {
      this.router.navigate(['./component/', rootNode.id], { relativeTo: this.activatedRoute.parent });
    }

    // case: root node of type Interface
    // => handles many interface issues, opens their Interface Issues page
    if (rootNode.type === issueGraphNodes.NodeType.Interface) {
      this.router.navigate(['./interface/', rootNode.id], { relativeTo: this.activatedRoute.parent });
    }
  }
  
  /**
   * Closes all component actions
   * for ex. when component is moved, page is reloaded or new page is loaded.
   * @param  {boolean=true} reload
   */
  private closeComponentActions(reload: boolean = true): boolean {

    // case: there are actions to close
    if (this.componentActionsOverlay) {

      // case: redraw of the graph needed 
      // => issues redraw ?
      if (reload) {
        this.reload();
      }

      // cancels component actions
      this.componentActionsOverlay.close();
      this.componentActionsOverlay = null;
      this.componentActionsOverlayId = null;

      return true;
    }

    return false;
  }
  
  /**
   * Issues a redraw of the graph. ?
   */
  public reload(): void {
    this.reload$.next(null);
  }

  /**
   * Method gets triggered when the minimap renders.
   * @param  {GraphEditor} minimap - Minimap that is handled.
   */
  private onMinimapRender(minimap: GraphEditor): EventListenerOrEventListenerObject {
    return (event: CustomEvent) => {

      // case: renders the minimap completely
      if (event.detail.rendered === 'complete') {
        minimap.completeRender();
        minimap.zoomToBoundingBox();
      }
      
      // case: renders texts
      else if (event.detail.rendered === 'text') {
        // irrelevant for the minimap
      }
      
      // case: renders node classes
      else if (event.detail.rendered === 'classes') {
        minimap.updateNodeClasses();
      }
      
      // case: renders node positions
      else if (event.detail.rendered === 'positions') {
        minimap.updateGraphPositions();
        minimap.zoomToBoundingBox();
      }
    };
  }



  // drawGaph 



  /**
   * Responsible for drawing the graph based on this.graphData.
   * Takes care of adding interfaces and components, and their connections.
   * Additionally adds issue folders attached to each component and the dashed edges
   * between them based on this.graphData.relatedFolders
   */
  drawGraph() {
    const boundingBox = this.calculateBoundingBox();
    // reset graph and remove all elements, gives us clean slate
    this.resetGraph();

    const layoutGraph = Object.keys(this.savedPositions.nodes).length === 0;
    // create nodes corresponding to the components and interfaces of the project
    const componentNodes = Array.from(this.graphData.components.values()).map(component =>
      issueGraphNodes.createComponentNode(component, this.findIdealComponentPosition(component.id, boundingBox)));
    const interfaceNodes = Array.from(this.graphData.interfaces.values()).map(
      intrface => issueGraphNodes.createInterfaceNode(intrface, this.savedPositions.nodes[intrface.id]));
    // issueNodes contains BOTH componentNodes and interfaceNodes
    const issueNodes = (componentNodes as issueGraphNodes.IssueNode[]).concat(interfaceNodes as issueGraphNodes.IssueNode[]);
    // For components AND interfaces: add the edges, issue folders and relations between folders
    issueNodes.forEach(node => {
      this.graph.addNode(node);
      this.addIssueFolders(node);
      this.drawFolderRelations(node);
    });
    // ONLY for interfaces: create edges connecting interface to offering component and consuming components to interface
    interfaceNodes.forEach(interfaceNode => {
      this.connectToOfferingComponent(interfaceNode);
      this.connectConsumingComponents(interfaceNode);
    });

    // render all changes
    this.graph.completeRender();
    this.setGraphToLastView();
    if (layoutGraph && issueNodes.length > 0) {
      this.layoutGraph();
      this.drawGraph();
    }
  }

  /**
   * Resets graph state. Called at start of draw(). Enables logic in draw()
   * to assume a 'blank sheet' state avoiding complex updating logic.
   */
  resetGraph() {
    this.graph.edgeList = [];
    this.graph.nodeList = [];
    this.issueGroupParents = [];
    this.graph.groupingManager.clearAllGroups();
  }

  /**
   * Finds the ideal component position if none is saved.
   * @param  {string} id - Id of component that is handled.
   * @param  {Rect} boundingBox - Bounding box of the component that is handled.
   */
  findIdealComponentPosition(id: string, boundingBox: Rect): Point {

    // saved position
    const saved = this.savedPositions.nodes[id];

    // case: there is a saved position
    // => return it
    if (saved) {
      return saved;
    }

    // calculates the ideal position
    const point = {x: 0, y: 0};
    if (boundingBox) {
      point.x = boundingBox.x + boundingBox.width + 60;
      point.y = boundingBox.y + boundingBox.height / 2;
    }

    // saves the ideal position
    this.savedPositions.nodes[id] = point;

    return point;
  }

  /**
   * Creates and adds an edge between the node representing a component
   * an the node representing the interface itself.
   * @param node - Interface that is handled.
   */
  connectToOfferingComponent(node: issueGraphNodes.InterfaceNode) {
    this.graph.addEdge(issueGraphNodes.createInterfaceProvisionEdge(node.offeredById, node.id));
  }

  /**
   * Adds an edge from each connected component to the interface.
   * @param interfaceNode - Interface (visualized by lollipop notation) that is handled.
   */
  connectConsumingComponents(interfaceNode: issueGraphNodes.InterfaceNode) {
    for (const consumerId of this.graphData.interfaces.get(interfaceNode.id).consumedBy) {
      this.graph.addEdge(issueGraphNodes.createConsumptionEdge(consumerId, interfaceNode.id));
    }
  }

  /**
   * Adds the issue folders with counts for each IssueCategory (currently 3)
   * to the component or interface represented by node. The first methods call
   * sets up invisible nodes in the graph to make the folders display properly.
   * The second method takes care of actually adding the visible folders with
   * the correct counts.
   * @param node - Interface / component that is handled.
   */
  private addIssueFolders(node: issueGraphNodes.IssueNode) {
    this.addIssueGroupContainer(node);
    this.addIssueFolderNodes(node);
  }

  /**
   * Creates the node groups necessary for displaying issue folders attached to a node.
   * A Node represents a component or an interface.
   * It also gets an issue group of IssueGroupContainerParentBehaviour,
   * issueGroupContainerNode with IssueGroupContainerBehaviour gets added to it.
   * This corresponds to the 4 'Grouping Manager' object
   * on the upper two levels in the graph_structure_documentation.png.
   * @param node - Node (component or interface) which can have issue folders attached.
   */
  private addIssueGroupContainer(node: issueGraphNodes.IssueNode) {
    const gm = this.graph.groupingManager;
    gm.markAsTreeRoot(node.id);
    const issueGroupContainerNode = issueGraphNodes.createIssueGroupContainerNode(node);
    const initialPosition = this.savedPositions.issueGroups[issueGroupContainerNode.id];
    gm.setGroupBehaviourOf(
      node.id,
      new IssueGroupContainerParentBehaviour(initialPosition)
    );

    // the issueGroupContainerNode has no visual representation but contains the visible issue folders
    node.issueGroupContainer = issueGroupContainerNode;
    this.graph.addNode(issueGroupContainerNode);
    gm.addNodeToGroup(node.id, issueGroupContainerNode.id);
    gm.setGroupBehaviourOf(
      issueGroupContainerNode.id,
      new IssueGroupContainerBehaviour()
    );
    this.issueGroupParents.push(node);
  }

  /**
   * This method presumes that node has the 4 'Grouping Manager Objects'
   * depicted on the the upper levels in the graph_structure_documentation.png.
   * correctly setup.
   * @param node Interface / component that is handled.
   */
  private addIssueFolderNodes(node: issueGraphNodes.IssueNode) {
    // get mapping from IssueCategory to number for the component or interface represented by node
    const issueCounts = this.graphData.graphLocations.get(node.id).issues;
    // iterate over issue categories and create a node if there is at least one issue of it
    Object.keys(IssueCategory).forEach(key => {
      const issueCategory = IssueCategory[key];
      if (issueCounts.has(issueCategory)) {
        const count = issueCounts.get(issueCategory);
        // only show folders for issue categories with at least one issue
        if (count > 0) {
          const issueFolderNode = issueGraphNodes.createIssueFolderNode(node, issueCategory, count.toString());
          this.graph.addNode(issueFolderNode);
          this.graph.groupingManager.addNodeToGroup(node.issueGroupContainer.id, issueFolderNode.id);
        }
      }
    });
  }

  /**
   * Draws folder relations originating from the issue folder represented by node.
   * @param node - Issue folder (for issues of a certain type) that is handled.
   */
  private drawFolderRelations(node: issueGraphNodes.IssueNode) {
    // @ts-ignore
    const folderNodes: IssueFolderNode[] = Array.from(node.issueGroupContainer.issueGroupNodeIds).map(
      (id: string) => this.graph.getNode(id));
    for (const folderNode of folderNodes) {
      const relatedFolders = this.graphData.relatedFolders.getValue([node.id.toString(), folderNode.type]);
      for (const relatedFolder of relatedFolders) {
        const [issueNodeId, category] = relatedFolder;
        const edge = issueGraphNodes.createRelationEdge(folderNode.id, issueGraphNodes.getIssueFolderId(issueNodeId, category));
        this.graph.addEdge(edge);
      }
    }
  }

  /**
   * Sets the view and the bounding box of the graph to how it was when the user left the graph with the help of localStorage.
   * When theres no previous session available set the view to the optimized bounding box for the graph.
   */
  private setGraphToLastView() {
    // The previous currentViewWindow of the graph as JSON string
    const previousBoundingBoxAsString = localStorage.getItem(`zoomBoundingBox_${this.projectStorageKey}`);
    // The previous zoomTransform of the graph as JSON string
    const zoomTransformAsString = localStorage.getItem(`zoomTransform_${this.projectStorageKey}`);
    // Only set the bounding box to the optimized bounding box for the graph when creating the first component
    const firstComponent = this.graphData.components.size === 1 ? true : false;

    // Set the bounding box to the bounding box of the last session or to the optimized bounding box if there wasnt a last session
    if ((JSON.parse(previousBoundingBoxAsString) !== null) && (JSON.parse(zoomTransformAsString) !== null) && this.graphFirstRender
      && !this.redrawByCloseOfComponentDetails && !firstComponent) {
      const previousBoundingBox = JSON.parse(previousBoundingBoxAsString);
      /* These calculations are necessary because of how GraphEditor.zoomToBox(box: Rect) works. GraphEditor.zoomToBox zooms to
      the given box and adds some padding.These calculations get rid of the padding. Otherwise the padding would be added to the graph
       with every execution of the setGraphToLastView() method. */
      previousBoundingBox.width = previousBoundingBox.width * 0.9;
      previousBoundingBox.height = previousBoundingBox.height * 0.9;
      // Difference between Rect.x that is given into the GraphEdit.zoomToBox(box: Rect) method and the resulting Rect.x
      const paddingX = 57.75 / JSON.parse(zoomTransformAsString).k;
      // Difference between Rect.y that is given into the GraphEdit.zoomToBox(box: Rect) method and the resulting Rect.y
      const paddingY = 17.2 / JSON.parse(zoomTransformAsString).k;
      previousBoundingBox.x = previousBoundingBox.x + paddingX;
      previousBoundingBox.y = previousBoundingBox.y + paddingY;
      this.graph.zoomToBox(previousBoundingBox);
      this.graphFirstRender = false;
    }
    // Zoom to the optimized bounding box if no graph view is stored from the last session or when the first component is created
    else if ((this.zoomOnRedraw && !this.redrawByCloseOfComponentDetails) || firstComponent) {
      this.fitGraphInView();
      this.zoomOnRedraw = false;
    }
  }

  /**
   * Fits the graph into view.
   */
  fitGraphInView(): void {

    // calculates the bounding box of the view
    const rect = this.calculateBoundingBox();

    // case: bounding box is calculated
    // => zoom to bounding box
    if (rect) {
      this.graph.zoomToBox(rect);
    }
  }

  /**
   * Calculates the bounding box of the view.
   * @returns The calculated bounding box.
   */
  calculateBoundingBox(): Rect {
    const componentSize = {width: 100, height: 60};
    const interfaceSize = {width: 14, height: 14};
    const issueContainerSize = {width: 40, height: 30};

    // calculates bounding box
    let rect = null;
    for (const node of this.graph.nodeList) {
      let size;
      if (node.type === issueGraphNodes.NodeType.Component) {
        size = componentSize;
      } else if (node.type === issueGraphNodes.NodeType.Interface || node.type === issueGraphNodes.NodeType.InterfaceConsumer) {
        size = interfaceSize;
      } else if (node.type === issueGraphNodes.NodeType.IssueGroupContainer) {
        if (node.issueGroupNodeIds.size === 0) {
          // irrelevant for empty issue group containers
          continue;
        }

        size = issueContainerSize;
      } else {
        continue;
      }

      const nodeX = node.x - size.width / 2;
      const nodeY = node.y - size.height / 2;

      if (rect === null) {
        rect = {xMin: nodeX, yMin: nodeY, xMax: nodeX + size.width, yMax: nodeY + size.height};
      } else {
        rect.xMin = Math.min(nodeX, rect.xMin);
        rect.yMin = Math.min(nodeY, rect.yMin);

        rect.xMax = Math.max(nodeX + size.width, rect.xMax);
        rect.yMax = Math.max(nodeY + size.height, rect.yMax);
      }
    }

    return rect ? {x: rect.xMin, y: rect.yMin, width: rect.xMax - rect.xMin, height: rect.yMax - rect.yMin} : null;
  }

  /**
   * Handles the layour graph.
   */
  layoutGraph(): void {
    const nodes = new Map<string | number, LayoutNode>();

    for (const node of this.graph.nodeList) {
      if (node.type === issueGraphNodes.NodeType.Component || node.type === issueGraphNodes.NodeType.Interface) {
        nodes.set(node.id, new LayoutNode(node.id, node.x, node.y, node.type));
      }
    }

    for (const edge of this.graph.edgeList) {
      if (nodes.has(edge.source) && nodes.has(edge.target)) {
        nodes.get(edge.source).connectTo(nodes.get(edge.target));
        nodes.get(edge.target).connectTo(nodes.get(edge.source));
      }
    }

    const nodeList = Array.from(nodes.values());
    doGraphLayout(nodeList);

    for (const node of nodeList) {
      const layoutNode = nodes.get(node.id);
      this.savedPositions.nodes[layoutNode.id] = {x: layoutNode.position.x, y: layoutNode.position.y};
    }

    this.savePositionsSubject.next();
  }



  // ...
  


  /**
   * Sets --show-relations css variable to initial or none. It is the value
   * of the display attribute of the edges. If we set it to none the edges disappear.
   * @param showRelations - Boolean derived from the setting of the switch slider for relation edges above the graph.
   */
  setRelationVisibility(showRelations: boolean) {
    this.graph.getSVG().style('--show-relations', showRelations ? 'initial' : 'none');
  }

  /**
   * Opens create component dialog and triggers reload of data after the dialog is closed.
   */
  public openCreateComponentDialog(): void {
    const createComponentDialogRef = this.dialog.open(CreateComponentDialogComponent, {
      data: {projectId: this.projectId}
    });
    createComponentDialogRef.afterClosed().subscribe(componentInformation => {
      this.zoomOnRedraw = false;
      this.reload$.next(null);
    });
  }

}
