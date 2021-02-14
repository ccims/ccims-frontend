import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DynamicNodeTemplate, DynamicTemplateContext } from '@ustutt/grapheditor-webcomponent/lib/dynamic-templates/dynamic-template';
import { DraggedEdge, Edge, edgeId, Point } from '@ustutt/grapheditor-webcomponent/lib/edge';
import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor';
import { LinkHandle } from '@ustutt/grapheditor-webcomponent/lib/link-handle';
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { Rect } from '@ustutt/grapheditor-webcomponent/lib/util';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, first, takeUntil, tap } from 'rxjs/operators';
import { IssueGraphStateService } from '../../data/issue-graph/issue-graph-state.service';
import { IssueGroupContainerBehaviour, IssueGroupContainerParentBehaviour } from './group-behaviours';
import { CreateInterfaceDialogComponent } from '@app/dialogs/create-interface-dialog/create-interface-dialog.component';
import { StateService } from '@app/state.service';
import { CreateInterfaceData } from '../../dialogs/create-interface-dialog/create-interface-dialog.component';
import { GraphData } from '../../data/issue-graph/graph-data';
import { IssueCategory } from 'src/generated/graphql';
import {
  Position, IssueNode, createIssueGroupContainerNode, createInterfaceNode,
  createComponentNode, createIssueFolderNode, InterfaceNode, IssueGroupContainerNode, createRelationEdge, getIssueFolderId, ComponentNode,
  createConsumptionEdge, createInterfaceProvisionEdge
} from './issue-graph-nodes';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateComponentDialogComponent } from '@app/dialogs/create-component-dialog/create-component-dialog.component';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { InterfaceStoreService } from '@app/data/interface/interface-store.service';

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

  constructor(private dialog: MatDialog, private gs: IssueGraphStateService, private ss: StateService,
              private router: Router, private activatedRoute: ActivatedRoute, private componentStoreService: ComponentStoreService,
              private interfaceStoreService: InterfaceStoreService) {
  }
  @ViewChild('graph', { static: true }) graphWrapper: { nativeElement: GraphEditor; };
  @ViewChild('minimap', { static: true }) minimap: { nativeElement: GraphEditor; };

  currentVisibleArea: Rect = { x: 0, y: 0, width: 1, height: 1 };
  @Input() projectId: string;

  readonly zeroPosition = { x: 0, y: 0 };

  public graphData: GraphData;

  private graphInitialized = false;
  private zoomOnRedraw = true;
  private graph: GraphEditor;

  // contains nodes representing interfaces and components which utilize node groups for display of issue folders
  private issueGroupParents: Node[] = [];

  private saveNodePositionsSubject = new Subject<null>();
  private nodePositions: {
    [prop: string]: Point;
  } = {};

  private destroy$ = new ReplaySubject(1);
  public reload$: BehaviorSubject<void> = new BehaviorSubject(null);

  // local storage key for positions of graph elements
  private projectStorageKey: string;


  /**
   * Get reference to MICO grapheditor instance and initialize
   */
  ngAfterViewInit(): void {
    this.graph = this.graphWrapper.nativeElement;
    this.initGraph();
  }

  /**
   * Setup local storage key for graph element positions
   */
  ngOnInit() {
    this.projectStorageKey = `CCIMS-Project_${this.projectId}`;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  initGraph() {
    if (this.graphInitialized) {
      return;
    }
    this.nodePositions = this.loadNodePositions();
    this.saveNodePositionsSubject
      .pipe(takeUntil(this.destroy$), debounceTime(300))
      .subscribe(() => {
        console.log('Setting: ', this.projectStorageKey);
        if (this.nodePositions != null) {
          const newData = JSON.stringify(this.nodePositions);
          localStorage.setItem(this.projectStorageKey, newData);
        }
      });
    this.graphInitialized = true;
    const graph: GraphEditor = this.graphWrapper.nativeElement;
    const minimap: GraphEditor = this.minimap.nativeElement;
    const nodeClassSetter = (className: string, node: Node) => {
      if (className === node.type) {
        return true;
      }
      return false;
    };
    graph.setNodeClass = nodeClassSetter;
    minimap.setNodeClass = nodeClassSetter;
    const edgeClassSetter = (
      className: string,
      edge: Edge,
      sourceNode: Node,
      targetNode: Node
    ) => {
      if (className === edge.type) {
        return true;
      }
      if (className === 'related-to' && edge.type === 'relatedTo') {
        return true;
      }
      if (
        className === 'issue-relation' &&
        (edge.type === 'relatedTo' ||
          edge.type === 'duplicate' ||
          edge.type === 'dependency')
      ) {
        return true;
      }
      return false;
    };
    graph.setEdgeClass = edgeClassSetter;
    minimap.setEdgeClass = edgeClassSetter;

    const linkHandleCalculation = (
      edge: Edge | DraggedEdge,
      sourceHandles: LinkHandle[],
      source: Node,
      targetHandles: LinkHandle[],
      target: Node
    ) => {
      const handles = {
        sourceHandles,
        targetHandles,
      };
      if (source?.allowedAnchors != null) {
        handles.sourceHandles = sourceHandles.filter((linkHandle) => {
          if (Math.abs(linkHandle.x) > Math.abs(linkHandle.y)) {
            if (linkHandle.x > 0 && source.allowedAnchors.has('right')) {
              return true;
            }
            if (linkHandle.x < 0 && source.allowedAnchors.has('left')) {
              return true;
            }
          } else {
            if (linkHandle.y > 0 && source.allowedAnchors.has('bottom')) {
              return true;
            }
            if (linkHandle.y < 0 && source.allowedAnchors.has('top')) {
              return true;
            }
          }
          return false;
        });
      }
      if (target?.allowedAnchors != null) {
        handles.targetHandles = targetHandles.filter((linkHandle) => {
          if (Math.abs(linkHandle.x) > Math.abs(linkHandle.y)) {
            if (linkHandle.x > 0 && target.allowedAnchors.has('right')) {
              return true;
            }
            if (linkHandle.x < 0 && target.allowedAnchors.has('left')) {
              return true;
            }
          } else {
            if (linkHandle.y > 0 && target.allowedAnchors.has('bottom')) {
              return true;
            }
            if (linkHandle.y < 0 && target.allowedAnchors.has('top')) {
              return true;
            }
          }
          return false;
        });
      }
      return handles;
    };
    graph.calculateLinkHandlesForEdge = linkHandleCalculation;
    minimap.calculateLinkHandlesForEdge = linkHandleCalculation;

    // setup edge drag behaviour
    graph.onCreateDraggedEdge = this.onCreateEdge;
    graph.onDraggedEdgeTargetChange = this.onDraggedEdgeTargetChanged;
    graph.addEventListener('edgeadd', this.onEdgeAdd);
    graph.addEventListener('edgeremove', this.onEdgeRemove);
    graph.addEventListener('edgedrop', this.onEdgeDrop);

    // setup node click behaviour
    graph.addEventListener('nodeclick', this.onNodeClick);

    graph.dynamicTemplateRegistry.addDynamicTemplate('issue-group-container', {
      renderInitialTemplate(
        g,
        grapheditor: GraphEditor,
        context: DynamicTemplateContext<Node>
      ): void {
        // template is empty
        g.append('circle')
          .attr('x', 0)
          .attr('y', 0)
          .attr('r', 1)
          .style('opacity', 0);
      },
      updateTemplate(
        g,
        grapheditor: GraphEditor,
        context: DynamicTemplateContext<Node>
      ): void {
        // template is empty
      },
      getLinkHandles(g, grapheditor: GraphEditor): LinkHandle[] {
        return []; // template has no link handles
      },
    } as DynamicNodeTemplate);

    graph.addEventListener('nodedragend', (event: CustomEvent) => {
      const node = event.detail.node;
      // store node positioning information
      this.nodePositions[node.id] = {
        x: node.x,
        y: node.y,
      };
      this.saveNodePositionsSubject.next();
    });

    graph.addEventListener('nodeadd', (event: CustomEvent) => {
      if (event.detail.node.type === 'issue-group-container') {
        return;
      }
      const node = event.detail.node;
      minimap.addNode(node);
    });
    graph.addEventListener('noderemove', (event: CustomEvent) => {
      const node = event.detail.node;
      if (event.detail.node.type !== 'issue-group-container') {
        minimap.removeNode(node);
      }
      // clear stored information
      // delete this.nodePositions[node.id];
      // this.saveNodePositionsSubject.next();
    });

    graph.addEventListener('edgeadd', (event: CustomEvent) => {
      minimap.addEdge(event.detail.edge);
    });
    graph.addEventListener('edgeremove', (event: CustomEvent) => {
      minimap.removeEdge(event.detail.edge);
    });
    graph.addEventListener('render', (event: CustomEvent) => {
      if (event.detail.rendered === 'complete') {
        minimap.completeRender();
        minimap.zoomToBoundingBox();
      } else if (event.detail.rendered === 'text') {
        // ignore for minimap
      } else if (event.detail.rendered === 'classes') {
        minimap.updateNodeClasses();
      } else if (event.detail.rendered === 'positions') {
        minimap.updateGraphPositions();
        minimap.zoomToBoundingBox();
      }
    });
    graph.addEventListener('zoomchange', (event: CustomEvent) => {
      this.currentVisibleArea = event.detail.currentViewWindow;
    });
  }

  /**
   * Creates the node groups necessary for the display of issue folders
   * attached to node. Node represents a component or interface
   * node. Node itself gets an issue group of IssueGroupContainerParentBehaviour.
   * We add an issueGroupContainerNode with IssueGroupContainerBehaviour to it.
   * This corresponds to the 4 'Grouping Manager' object on the upper two levels in the graph_structure_documentation.png.
   * @param node represents a node which can have issue folders attached. Currently components or
   * interfaces.
   */
  private addIssueGroupContainer(node: IssueNode) {
    const gm = this.graph.groupingManager;
    gm.markAsTreeRoot(node.id);
    gm.setGroupBehaviourOf(
      node.id,
      new IssueGroupContainerParentBehaviour()
    );
    // the issueGroupContainerNode has no visual representation but contains the visible issue folders
    const issueGroupContainerNode = createIssueGroupContainerNode(node);
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
   * Create and add edge between node representing component to node representing the interface itself
   * @param node represents interface in graph
   */
  connectToOfferingComponent(node: InterfaceNode) {
    this.graph.addEdge(createInterfaceProvisionEdge(node.offeredById, node.id));
  }

  /**
   * Add an edge from each connected component to the interface.
   * @param interfaceNode visualized by lollipop notation
   */
  connectConsumingComponents(interfaceNode: InterfaceNode) {
    for (const consumerId of this.graphData.interfaces.get(interfaceNode.id).consumedBy) {
      this.graph.addEdge(createConsumptionEdge(consumerId, interfaceNode.id));
    }
  }

  /**
   * Responsible for drawing the graph based on this.graphData.
   * Takes care of adding interfaces and components, and their connections.
   * Additionally adds issue folders attached to each component and the dashed edges
   * between them based on this.graphData.relatedFolders
   */
  drawGraph() {
    // reset graph and remove all elements, gives us clean slate
    this.resetGraph();
    // create nodes corresponding to the components and interfaces of the project
    const componentNodes = Array.from(this.graphData.components.values()).map(component =>
      createComponentNode(component, this.nodePositions[component.id]));
    const interfaceNodes = Array.from(this.graphData.interfaces.values()).map(
      intrface => createInterfaceNode(intrface, this.nodePositions[intrface.id]));
    // issueNodes contains BOTH componentNodes and interfaceNodes
    const issueNodes = (componentNodes as IssueNode[]).concat(interfaceNodes as IssueNode[]);
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
    // zoomOnRedraw is set on first render & when user created a new component
    if (this.zoomOnRedraw) {
      this.zoomOnRedraw = false;
      this.graph.zoomToBoundingBox();
    }
  }


  /**
   * Adds the issue folders with counts for each IssueCategory (currently 3)
   * to the component or interface represented by node. The first methods call
   * sets up invisible nodes in the graph to make the folders display properly.
   * The second method takes care of actually adding the visible folders with
   * the correct counts.
   * @param node represents interface or component
   */
  private addIssueFolders(node: IssueNode) {
    this.addIssueGroupContainer(node);
    this.addIssueFolderNodes(node);
  }

  /**
   * This method presumes that node has the 4 'Grouping Manager Objects'
   * depicted on the the upper levels in the graph_structure_documentation.png.
   * correctly setup.
   * @param node represents interface or component
   */
  private addIssueFolderNodes(node: IssueNode) {
    // get mapping from IssueCategory to number for the component or interface represented by node
    const issueCounts = this.graphData.graphLocations.get(node.id).issues;
    // iterate over issue categories and create a node if there is at least one issue of it
    Object.keys(IssueCategory).forEach(key => {
      const issueCategory = IssueCategory[key];
      if (issueCounts.has(issueCategory)) {
        const count = issueCounts.get(issueCategory);
        // only show folders for issue categories with at least one issue
        if (count > 0) {
          const issueFolderNode = createIssueFolderNode(node, issueCategory, count.toString());
          this.graph.addNode(issueFolderNode);
          this.graph.groupingManager.addNodeToGroup(node.issueGroupContainer.id, issueFolderNode.id);
        }
      }
    });
  }

  /**
   * Draws folder relations originating from the issue folder represented by node.
   * @param node representing an issue folder for issues of a certain type
   */
  private drawFolderRelations(node: IssueNode) {
    // @ts-ignore
    const folderNodes: IssueFolderNode[] = Array.from(node.issueGroupContainer.issueGroupNodeIds).map(
      (id: string) => this.graph.getNode(id));
    for (const folderNode of folderNodes) {
      const relatedFolders = this.graphData.relatedFolders.getValue([node.id.toString(), folderNode.type]);
      for (const relatedFolder of relatedFolders) {
        const [issueNodeId, category] = relatedFolder;
        const edge = createRelationEdge(folderNode.id, getIssueFolderId(issueNodeId, category));
        this.graph.addEdge(edge);
      }
    }
  }

  private onCreateEdge = (edge: DraggedEdge) => {
    const graph: GraphEditor = this.graphWrapper.nativeElement;
    const createdFromExisting = edge.createdFrom != null;
    if (createdFromExisting) {
      // only allow delete or dropping at the same node
      const original = graph.getEdge(edge.createdFrom);
      edge.validTargets.clear();
      edge.validTargets.add(original.target.toString());
      return edge;
    }
    const sourceNode = graph.getNode(edge.source);
    if (sourceNode.type === 'component') {
      // update edge properties
      edge.type = 'interface';
      edge.dragHandles = []; // no drag handles
      // update valid targets
      edge.validTargets.clear();
      // allow only interfaces as targets
      graph.nodeList.forEach((node) => {
        if (node.type === 'interface') {
          edge.validTargets.add(node.id.toString());
        }
      });
      // allow only new targets
      graph.getEdgesBySource(sourceNode.id).forEach((existingEdge) => {
        edge.validTargets.delete(existingEdge.target.toString());
      });
    }
    return edge;
  }

  private onDraggedEdgeTargetChanged = (
    edge: DraggedEdge,
    sourceNode: Node,
    targetNode: Node
  ) => {
    if (sourceNode.type === 'component') {
      if (targetNode?.type === 'interface') {
        edge.type = 'interface-connect';
        edge.markerEnd = {
          template: 'interface-connector',
          relativeRotation: 0,
        };
        delete edge.dragHandles; // default drag handle
      } else {
        // target was null/create a new interface
        edge.type = 'interface';
        delete edge.markerEnd;
        edge.dragHandles = []; // no drag handles
      }
    }
    return edge;
  }

  private onEdgeAdd = (event: CustomEvent) => {
    if (event.detail.eventSource === 'API') {
      return;
    }
    const edge: Edge = event.detail.edge;
    if (edge.type === 'interface-connect') {
      event.preventDefault(); // cancel edge creation
      // and then update the graph via the api
      const sourceNode = this.graph.getNode(edge.source);
      const targetNode = this.graph.getNode(edge.target);
      if (sourceNode != null && targetNode != null) {
        console.log('Add comp to interface');
        this.gs.addConsumedInterface(sourceNode.id.toString(), targetNode.id.toString()).subscribe(
          () => this.reload$.next(null)
        );
      }
    }
  }

  private onEdgeDrop = (event: CustomEvent) => {
    if (event.detail.eventSource === 'API') {
      return;
    }
    const edge: DraggedEdge = event.detail.edge;
    if (edge.createdFrom != null) {
      return;
    }
    if (edge.type === 'interface') {
      this.addInterfaceToComponent(event.detail.sourceNode.id, event.detail.dropPosition);
    }
  }

  private onEdgeRemove = (event: CustomEvent) => {
    if (event.detail.eventSource === 'API') {
      return;
    }
    const edge: Edge = event.detail.edge;
    if (edge.type === 'interface-connect') {
      event.preventDefault(); // cancel edge deletion
      // and then update the graph via the api
      const graph: GraphEditor = this.graphWrapper.nativeElement;
      const sourceNode = graph.getNode(edge.source);
      const targetNode = graph.getNode(edge.target);
      if (sourceNode != null && targetNode != null) {
        this.gs.removeConsumedInterface(sourceNode.id.toString(), targetNode.id.toString()).subscribe(
          () => this.reload$.next(null)
        );
      }
    }
  }

  private onNodeClick = (event: CustomEvent) => {
    event.preventDefault(); // prevent node selection
    const node = event.detail.node;

    // if the clicked node in the graph is a component, the router will route to the component details view
    if (node.type === 'component') {
      this.router.navigate(['./component/', node.id], { relativeTo: this.activatedRoute.parent });
      console.log('Open component info sheet');
      return;
    }
    // if the clicked node in the graph is a interface, the router will route to the interface details view
    if (node.type === 'interface') {
      this.router.navigate(['./interface/', node.id], { relativeTo: this.activatedRoute.parent });
      return;
    }

    if (node.type.startsWith('issue-')) {
      const graph: GraphEditor = this.graphWrapper.nativeElement;
      const rootId = graph.groupingManager.getTreeRootOf(node.id);
      const rootNode = graph.getNode(rootId);
      if (rootNode.type === 'interface') {
        const componentNode = this.graph.getNode(node.componentNodeId);
        return;
      }

    }
    // if the clicked node in the graph is a issue folder, the issue count for the folder has to be determined
    if (node.type === 'BUG' || node.type === 'UNCLASSIFIED' || node.type === 'FEATURE_REQUEST') {
      const graph: GraphEditor = this.graphWrapper.nativeElement;
      const rootId = graph.groupingManager.getTreeRootOf(node.id);
      const rootNode = graph.getNode(rootId);

      // if there is only one issue inside the clicked folder the graph leads the user direktly to the issue details view
      if (node.issueCount < 2 && node.issueCount > 0) {
        // if the clicked folder is on a component the url for the issu ends like .../component/COMPONENTID/issue/ISSUEID
        if (rootNode.type === 'component') {
          this.componentStoreService.getFullComponent(rootId).subscribe(component => {
            const currentIssueId = this.extractIssueId(component.node.issues.nodes, node.type);
            this.router.navigate(['./', rootNode.type, rootId, 'issue', currentIssueId],
              { relativeTo: this.activatedRoute.parent });

          });
        } else {
          // if the clicked folder is on a interface the url for the issu ends like .../interface/INTERFACEID/component/COMPONENTID/issue/ISSUEID
          this.interfaceStoreService.getInterface(rootId).subscribe(componentInterface => {
            const currentIssueId = this.extractIssueId(componentInterface.node.issuesOnLocation.nodes, node.type);
            const componentId = componentInterface.node.component.id;
            this.router.navigate(['./', rootNode.type, rootId, 'component', componentId, 'issue', currentIssueId],
              { relativeTo: this.activatedRoute.parent });

          });
        }
        // if the issue count for the clicked folder is more than one
      } else {
        // if the clicked folder is on a interface, router opens interface details and jumps to the issues tab
        // if the clicked folder is on a component, router opens component details and jumps to the issues tab
        // a filter for the issue type is set
        // only issues of the selected issue type are displayed in the issue list
        if (rootNode.type === 'interface') {
          this.interfaceStoreService.getInterface(rootId).subscribe(componentInterface => {
            const currentIssueId = this.extractIssueId(componentInterface.node.issuesOnLocation.nodes, node.type);
            const componentId = componentInterface.node.component.id;
            this.router.navigate(['./', 'component', componentId, rootNode.type, rootId],
              // the selected param defines the tab of the details view 0 means component details. 1 means component issues
              { relativeTo: this.activatedRoute.parent, queryParams: { selected: '1', filter: node.type } });
          });
        }
        this.router.navigate(['./', rootNode.type, rootId],
          { relativeTo: this.activatedRoute.parent, queryParams: { selected: '1', filter: node.type } });
      }
      return;
    }
    console.log('Clicked on another type of node:', node);
  }

  /**
   * load positions of graph elements from local storage
   */
  private loadNodePositions() {
    const data = localStorage.getItem(this.projectStorageKey);
    if (data == null) {
      return {};
    }
    return JSON.parse(data);
  }

  /**
   * Opens interface creation dialog. If the user actually creates the interface it
   * is added to component (offeredById) at posititon.
   * @param offeredById id of the comonent offering the would be interface
   * @param position of the interface of the would be interface. Its the position
   * where the user dropped the edge he dragged from the component.
   */
  private addInterfaceToComponent(offeredById: string, position: Position) {
    const data: CreateInterfaceData = {
      position,
      offeredById
    };

    const createInterfaceDialogRef = this.dialog.open(CreateInterfaceDialogComponent, {
      data
    });

    createInterfaceDialogRef.afterClosed().subscribe((interfaceId) => {
      this.nodePositions[interfaceId] = {
        x: position.x,
        y: position.y
      };
      this.saveNodePositionsSubject.next();
      this.reload$.next(null);
    });
  }

  /**
   * Sets --show-relations css variable to initial or none. It is the value
   * of the display attribute of the edges. If we set it to none the edges disappear.
   * @param showRelations boolean derived from the setting of the switch slider for relation edges
   * above the graph
   */
  setRelationVisibility(showRelations: boolean) {
    this.graph.getSVG().style('--show-relations', showRelations ? 'initial' : 'none');
  }


  /**
   * Opens create component dialog and triggers reload of data after the dialog is closed.
   */
  public openCreateComponentDialog(): void {
    const createComponentDialogRef = this.dialog.open(CreateComponentDialogComponent, {
      data: { projectId: this.projectId }
    });
    createComponentDialogRef.afterClosed().subscribe(componentInformation => {
      this.zoomOnRedraw = true;
      this.reload$.next(null);
    });
  }

  /**
   * @param issueList contains ids of issues
   * @param category category of issue e.g. bug
   * @returns id of first issue of category in issue list
   */
  private extractIssueId(issueList, category: string): string {
    for (const issue of issueList) {
      if (issue.category === category) {
        return issue.id;
      }
    }
  }
}
