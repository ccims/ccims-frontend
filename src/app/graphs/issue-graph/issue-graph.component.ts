import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DynamicNodeTemplate, DynamicTemplateContext } from '@ustutt/grapheditor-webcomponent/lib/dynamic-templates/dynamic-template';
import { DraggedEdge, Edge, edgeId, Point } from '@ustutt/grapheditor-webcomponent/lib/edge';
import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor';
import { LinkHandle } from '@ustutt/grapheditor-webcomponent/lib/link-handle';
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { Rect } from '@ustutt/grapheditor-webcomponent/lib/util';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, first, takeUntil, tap } from 'rxjs/operators';
import { Component as ProjectComponent, Issue, IssueRelationType, IssuesState, IssueType, Project } from 'src/app/model/state';
import { issues as mockIssues } from '../../model/graph-state';
// import { ApiService } from 'src/app/api/api.service';
// import { CreateInterfaceDialogComponent } from 'src/app/dialogs/create-interface-dialog-demo/create-interface-dialog.component';
// import { MatBottomSheet } from '@angular/material/bottom-sheet';
// import { GraphNodeInfoSheetComponent } from 'src/app/dialogs/graph-node-info-sheet-demo/graph-node-info-sheet.component';
import { IssueGraphStoreService } from '../../data/issue-graph/issue-graph-store.service';
import { IssueGroupContainerBehaviour, IssueGroupContainerParentBehaviour } from './group-behaviours';
import { CreateInterfaceDialogComponent } from '@app/dialogs/create-interface-dialog/create-interface-dialog.component';
import { StateService } from '@app/state.service';
import { CreateInterfaceData } from '../../dialogs/create-interface-dialog/create-interface-dialog.component';
import { GraphComponent, GraphInterface, GraphData } from '../../data/issue-graph/graph-data';
import { MatDrawer } from '@angular/material/sidenav';
import { GraphContainerComponent } from '../graph-container/graph-container.component';
import { IssueCategory } from 'src/generated/graphql';

@Component({
  selector: 'app-issue-graph',
  templateUrl: './issue-graph.component.html',
  styleUrls: ['./issue-graph.component.css'],
})
export class IssueGraphComponent implements OnInit, OnDestroy {
  @ViewChild('graph', { static: true }) graphWrapper;
  @ViewChild('minimap', { static: true }) minimap;

  currentVisibleArea: Rect = { x: 0, y: 0, width: 1, height: 1 };
  @Input() drawer: MatDrawer;
  @Input() projectId: string;
  @Input() containerComponent: GraphContainerComponent;
  @Input() blacklistFilter: {
    [IssueType.BUG]?: boolean;
    [IssueType.FEATURE_REQUEST]?: boolean;
    [IssueType.UNCLASSIFIED]?: boolean;
  } = {};

  readonly zeroPosition = { x: 0, y: 0 };

  private graphData: GraphData;

  private graphInitialized = false;
  private firstDraw = true;
  private graph: GraphEditor;

  private issueGroupParents: Node[] = [];

  private saveNodePositionsSubject = new Subject<null>();
  private nodePositions: {
    [prop: string]: Point;
  } = {};

  private destroy$ = new ReplaySubject(1);

  private issuesById: IssuesState = {};
  private issueToRelatedNode: Map<string, Set<string>> = new Map();
  private issueToGraphNode: Map<string, Set<string>> = new Map();
  private projectStorageKey: string;

  private filterObs: BehaviorSubject<string> = new BehaviorSubject('blah');

  public reload() {
    this.filterObs.next('blah');
  }

  constructor(private dialog: MatDialog, private gs: IssueGraphStoreService, private ss: StateService, private cont: GraphContainerComponent) {
    // , private bottomSheet: MatBottomSheet) {}
    this.gs.graphDataForFilter(this.filterObs).pipe(
      tap(newGraphData => {
        this.graphData = newGraphData;
        this.drawGraph();
      })
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnInit() {
    this.projectStorageKey = `CCIMS-Project_${this.projectId}`;
    this.graph = this.graphWrapper.nativeElement;
    this.initGraph();
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
      //delete this.nodePositions[node.id];
      //this.saveNodePositionsSubject.next();
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
  private addIssueGroupContainer(node: Node) {
    const gm = this.graph.groupingManager;
    gm.markAsTreeRoot(node.id);
    gm.setGroupBehaviourOf(
      node.id,
      new IssueGroupContainerParentBehaviour()
    );

    const issueGroupContainerNode = {
      id: `${node.id}__issue-group-container`,
      type: 'issue-group-container',
      dynamicTemplate: 'issue-group-container',
      x: 0,
      y: 0,
      position: 'bottom',
      issueGroupNodes: new Set<string>(),
    };
    this.graph.addNode(issueGroupContainerNode);
    gm.addNodeToGroup(node.id, issueGroupContainerNode.id);
    gm.setGroupBehaviourOf(
      issueGroupContainerNode.id,
      new IssueGroupContainerBehaviour()
    );
    this.issueGroupParents.push(node);
  }


  resetGraph() {
    this.graph.edgeList = [];
    this.graph.nodeList = [];
    this.issueGroupParents = [];
    this.graph.groupingManager.clearAllGroups();
  }

  componentNode(component: GraphComponent): ComponentNode {
    const componentNode = {
      ...(this.nodePositions[component.id] || this.zeroPosition),
      id: component.id,
      title: component.name,
      type: 'component',
      data: component,
    };
    return componentNode;
  }

  interfaceNode(intrface: GraphInterface): InterfaceNode {
    const interfaceNode = {
      ...(this.nodePositions[intrface.id] || this.zeroPosition),
      id: intrface.id,
      title: intrface.name,
      type: 'interface',
      offeredById: intrface.offeredBy,
    };
    return interfaceNode;
  }

  issueFolderId(node: Node, issueCategory: IssueCategory): string {
    return `${node.id}__${issueCategory}`;
  }

  issueFolderNode(node: Node, issueCategory: IssueCategory): IssueFolderNode {
    return {
      id: this.issueFolderId(node, issueCategory),
      type: issueCategory,
      x: 0,
      y: 0,
      issues: new Set<string>(),
      issueCount: '0'
    };
  }
  setupNode(node: ComponentNode | InterfaceNode) {
    this.graph.addNode(node);
  }

  connectToOfferingComponent(node: InterfaceNode) {
    const edge = {
      source: node.offeredById,
      target: node.id,
      type: 'interface',
      dragHandles: [],
    };
    this.graph.addEdge(edge);
  }

  drawGraph(shouldZoom: boolean = true) {
    //Upto next comment: Graph Reset & Drawing nodes again & Connecting interfaces to the offering component
    this.resetGraph();
    const componentNodes = Array.from(this.graphData.components.values()).map(component => this.componentNode(component));
    componentNodes.forEach(node => {
      this.setupNode(node);
      this.addIssueFolders(node);
    });
    const interfaceNodes = Array.from(this.graphData.interfaces.values()).map(intrface => this.interfaceNode(intrface));
    interfaceNodes.forEach(node => {
      this.setupNode(node);
      this.connectToOfferingComponent(node);
      this.addIssueFolders(node);
    });


    /*

      this.updateIssuesForNode(this.graph, componentGraphNode, graphComponent.issues, mockIssues);
      //this.newUpdateIssuesForNode(graph, componentGraphNode, graphComponent.issueCounts);
      issueGroupParents.push(componentGraphNode);

      Object.keys(graphComponent.interfaces).forEach((interfaceId) => {

        // new interface type has no issues only issue counts
        this.updateIssuesForNode(this.graph, interfaceNode, intface.issues, mockIssues);
        issueGroupParents.push(interfaceNode);
      });

      //add edges from components to other components interfaces and to other coqmponents
      graphComponent.componentRelations.forEach((relation) => {
        let edge: Edge;
        if (relation.targetType === 'component') {
          edge = {
            source: componentNodeId,
            target: `component_${relation.targetId}`,
            type: 'component-connect',
            markerEnd: {
              template: 'arrow',
              relativeRotation: 0,
            },
          };
        } else if (relation.targetType === 'interface') {
          edge = {
            source: componentNodeId,
            target: `interface_${relation.targetId}`,
            type: 'interface-connect',
            markerEnd: {
              template: 'interface-connector',
              relativeRotation: 0,
            },
          };
        }
        this.graph.addEdge(edge);
      });
    });


    issueGroupParents.forEach((node) => this.updateIssueRelations(this.graph, node, mockIssues));

    //this.issuesById = issues;
    */
    this.graph.completeRender();
    if (this.firstDraw) {
      this.graph.zoomToBoundingBox();
    }
    this.firstDraw = false;
  }

  addIssueFolders(node: ComponentNode | InterfaceNode) {
    this.addIssueGroupContainer(node);
    this.addIssueFolderNodes(node);
  }

  private addIssueFolderNodes(node: ComponentNode | InterfaceNode) {
    const issueGroupContainer = this.graph.getNode(`${node.id}__issue-group-container`);
    Object.keys(IssueCategory).forEach((category: IssueCategory) => {
      const issueFolderNode = this.issueFolderNode(node, category);
      this.graph.addNode(issueFolderNode);
      this.graph.groupingManager.addNodeToGroup(issueGroupContainer.id, issueFolderNode.id);
    });
  }


  issueGroupContainerId(node: Node): string {
    return `${node.id}__issue-group-container`;
  }


  private updateIssueRelations(
    graph: GraphEditor,
    parentNode: Node,
    issues: IssuesState
  ) {
    const issueGroupContainer = graph.getNode(
      `${parentNode.id}__issue-group-container`
    );
    if (issueGroupContainer.issueGroupNodes.size === 0) {
      return;
    }

    issueGroupContainer.issueGroupNodes.forEach((issueFolderId) => {
      const issueFolderNode = graph.getNode(issueFolderId);
      const edgesToDelete = new Set<string>();
      graph.getEdgesBySource(issueFolderId).forEach((edge) => {
        edgesToDelete.add(edgeId(edge));
        // TODO reset sets
        edge.sourceIssues?.clear();
      });

      issueFolderNode.issues.forEach((issueId) => {
        const issue = issues[issueId];

        if (issue == null) {
          return; // should not happen but just to be safe
        }

        issue.relatedIssues.forEach((rel) => {
          this.issueToGraphNode
            .get(rel.relatedIssueId)
            .forEach((targetNodeId) => {
              let edgeType = 'relatedTo';
              if (rel.relationType === IssueRelationType.DEPENDS) {
                edgeType = 'dependency';
              }
              if (rel.relationType === IssueRelationType.DUPLICATES) {
                edgeType = 'duplicate';
              }

              const relationEdgeId = `s${issueFolderId}t${targetNodeId}r${edgeType}`;
              edgesToDelete.delete(relationEdgeId);

              let relationEdge = graph.getEdge(relationEdgeId);

              if (relationEdge == null) {
                relationEdge = {
                  id: relationEdgeId,
                  source: issueFolderId,
                  target: targetNodeId,
                  type: edgeType,
                  markerEnd: {
                    template: 'arrow',
                    relativeRotation: 0,
                  },
                  dragHandles: [],
                  sourceIssues: new Set<string>(),
                };
                graph.addEdge(relationEdge);
              }

              relationEdge.sourceIssues.add(issueId);
            });
        });
      });

      edgesToDelete.forEach((id) => {
        const edge = graph.getEdge(id);
        if (edge) {
          // FIXME after grapheditor update (just use the edgeId in removeEdge)
          graph.removeEdge(edge);
        }
      });
    });
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
        // this.api.addComponentToInterfaceRelation(sourceNode.data.id, targetNode.data.id);
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
        // this.api.removeComponentToInterfaceRelation(sourceNode.data.id, targetNode.data.id);
      }
    }
  }

  private onNodeClick = (event: CustomEvent) => {
    event.preventDefault(); // prevent node selection
    const node = event.detail.node;

    if (node.type === 'component') {
      this.cont.recieveNode(node);


      // TODO show a edit component dialog (or similar)
      /*
            this.bottomSheet.open(GraphNodeInfoSheetComponent, {
                data: {
                    projectId: this.project.id,
                    component: node.data,
                    issues: [...node.relatedIssues],
                }
            });
            return;
            */
      console.log('Open component info sheet');
    }
    if (node.type === 'interface') {
      const componentNode = this.graph.getNode(node.componentNodeId);
      // TODO show a edit interface dialog (or similar)
      /*
            this.bottomSheet.open(GraphNodeInfoSheetComponent, {
                data: {
                    projectId: this.project.id,
                    // TODO add as info when interfaces can have issues in the backend
                    // component: componentNode.data,
                    interface: node.data,
                    issues: [...node.relatedIssues],
                }
            });
            return;
            */
      console.log('Open Interface Info Sheet');
    }
    if (node.type.startsWith('issue-')) {
      const graph: GraphEditor = this.graphWrapper.nativeElement;
      const rootId = graph.groupingManager.getTreeRootOf(node.id);
      const rootNode = graph.getNode(rootId);

      if (rootNode.type === 'component') {
        // TODO show a edit component dialog (or similar)
        /*
                this.bottomSheet.open(GraphNodeInfoSheetComponent, {
                    data: {
                        projectId: this.project.id,
                        component: rootNode.data,
                        issues: [...node.issues],
                    }
                });
                return;
                */
        console.log('Show component bottom sheet');
      }

      if (rootNode.type === 'interface') {
        const componentNode = this.graph.getNode(node.componentNodeId);
        /*
                // TODO show a edit component dialog (or similar)
                this.bottomSheet.open(GraphNodeInfoSheetComponent, {
                    data: {
                        projectId: this.project.id,
                        // TODO add as info when interfaces can have issues in the backend
                        // component: componentNode.data,
                        interface: rootNode.data,
                        issues: [...node.issues],
                    }
                });
                */
        console.log('Show interface bottom sheet');
        return;
      }
      return;
    }
    console.log('Clicked on another type of node:', node);
  }

  private loadNodePositions() {
    const data = localStorage.getItem(this.projectStorageKey);
    if (data == null) {
      return {};
    }
    return JSON.parse(data);
  }

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
      this.reload();
    });
    /*
            createComponentDialog.afterClosed().subscribe((interfaceName: string) => {
                if (interfaceName != null && interfaceName !== '') {
                    this.api.addComponentInterface(componentId, interfaceName);
                }
            });
          */
    console.log('Open Create Interface Dialog Component');
  }
}

interface ComponentNode extends Node {
  title: string;
  data: GraphComponent;
}

interface InterfaceNode extends Node {
  title: string;
  offeredById: string;
}

interface IssueFolderNode extends Node {
    type: IssueCategory;
    issueCount: string;
}

interface Position {
  x: number;
  y: number;
}
