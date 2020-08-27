import { Component, ViewChild, Input, OnChanges, OnInit, SimpleChanges, OnDestroy } from '@angular/core';
import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor';
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { Edge, Point, DraggedEdge, edgeId } from '@ustutt/grapheditor-webcomponent/lib/edge';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Rect } from '@ustutt/grapheditor-webcomponent/lib/util';
import { GroupBehaviour } from '@ustutt/grapheditor-webcomponent/lib/grouping';
import { DynamicTemplateContext, DynamicNodeTemplate } from '@ustutt/grapheditor-webcomponent/lib/dynamic-templates/dynamic-template';
import { LinkHandle } from '@ustutt/grapheditor-webcomponent/lib/link-handle';
import { IssueGroupContainerParentBehaviour, IssueGroupContainerBehaviour } from './group-behaviours';
import { Store, select } from '@ngrx/store';
import { State, Project, Component as ProjectComponent, Issue, IssueType, IssueRelationType, IssuesState } from 'src/app/reducers/state';
import { selectIssueGraphData } from 'src/app/reducers/issueGraph.selector';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/api/api.service';
import { CreateInterfaceDialogComponent } from 'src/app/dialogs/create-interface-dialog-demo/create-interface-dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { GraphNodeInfoSheetComponent } from 'src/app/dialogs/graph-node-info-sheet-demo/graph-node-info-sheet.component';

@Component({
    selector: 'app-issue-graph',
    templateUrl: './issue-graph.component.html',
    styleUrls: ['./issue-graph.component.css']
})
export class IssueGraphComponent implements OnChanges, OnInit, OnDestroy {

    @ViewChild('graph', { static: true }) graph;
    @ViewChild('minimap', { static: true }) minimap;

    currentVisibleArea: Rect = { x: 0, y: 0, width: 1, height: 1 };

    @Input() project: Project;
    @Input() blacklistFilter: {
        [IssueType.BUG]?: boolean;
        [IssueType.FEATURE_REQUEST]?: boolean;
        [IssueType.UNCLASSIFIED]?: boolean;
    } = {};

    graphDataSubscription: Subscription;

    private currentComponents: ProjectComponent[];
    private currentIssues: IssuesState;
    private projectIsNew: boolean = true;


    private graphInitialized = false;

    private saveNodePositionsSubject = new Subject<null>();
    private saveNodePositionsSubscription: Subscription;
    private nodePositions: {
        [prop: string]: Point;
    } = {};

    private issuesById: IssuesState = {};
    private issueToRelatedNode: Map<string, Set<string>> = new Map();
    private issueToGraphNode: Map<string, Set<string>> = new Map();

    constructor(private store: Store<State>, private dialog: MatDialog, private bottomSheet: MatBottomSheet, private api: ApiService) {}

    ngOnInit() {
        this.initGraph();
    }

    ngOnDestroy() {
        this.graphDataSubscription?.unsubscribe();
        this.saveNodePositionsSubscription?.unsubscribe();
    }

    initGraph() {
        if (this.graphInitialized) {
            return;
        }
        this.graphInitialized = true;
        const graph: GraphEditor = this.graph.nativeElement;
        const minimap: GraphEditor = this.minimap.nativeElement;
        const nodeClassSetter = (className: string, node: Node) => {
            if (className === node.type) {
                return true;
            }
            return false;
        };
        graph.setNodeClass = nodeClassSetter;
        minimap.setNodeClass = nodeClassSetter;
        const edgeClassSetter = (className: string, edge: Edge, sourceNode: Node, targetNode: Node) => {
            if (className === edge.type) {
                return true;
            }
            if (className === 'related-to' && edge.type === 'relatedTo') {
                return true;
            }
            if (className === 'issue-relation' && (edge.type === 'relatedTo' || edge.type === 'duplicate' || edge.type === 'dependency')) {
                return true;
            }
            return false;
        };
        graph.setEdgeClass = edgeClassSetter;
        minimap.setEdgeClass = edgeClassSetter;

        const linkHandleCalculation = (edge: Edge|DraggedEdge, sourceHandles: LinkHandle[], source: Node, targetHandles: LinkHandle[], target: Node) => {
            const handles = {
                sourceHandles: sourceHandles,
                targetHandles: targetHandles,
            };
            if (source?.allowedAnchors != null) {
                handles.sourceHandles = sourceHandles.filter(linkHandle => {
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
                handles.targetHandles = targetHandles.filter(linkHandle => {
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
            renderInitialTemplate(g, grapheditor: GraphEditor, context: DynamicTemplateContext<Node>): void {
                // template is empty
                g.append('circle').attr('x', 0).attr('y', 0).attr('r', 1).style('opacity', 0);
            },
            updateTemplate(g, grapheditor: GraphEditor, context: DynamicTemplateContext<Node>): void {
                // template is empty
            },
            getLinkHandles(g, grapheditor: GraphEditor): LinkHandle[] {
                return []; // template has no link handles
            }
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
            delete this.nodePositions[node.id];
            this.saveNodePositionsSubject.next();
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

    ngOnChanges(changes: SimpleChanges) {
        this.initGraph();

        if (changes.project != null) {

            if (changes.project.previousValue?.id !== changes.project.currentValue?.id) {
                this.saveNodePositionsSubscription?.unsubscribe();
                this.projectIsNew = true;

                const graph: GraphEditor = this.graph.nativeElement;
                graph.edgeList = [];
                graph.nodeList = [];
                graph.groupingManager.clearAllGroups();

                graph.completeRender();
                graph.zoomToBoundingBox();

                this.loadProjectSettings(this.project?.id);

                this.graphDataSubscription?.unsubscribe();
                this.graphDataSubscription = this.store
                    .pipe(
                        select(selectIssueGraphData, {projectId: this.project?.id}),
                        debounceTime(30), // to give time for rendering the graph
                    ).subscribe(issueGraphData => {
                        this.currentComponents = issueGraphData.components;
                        this.currentIssues = issueGraphData.issues;
                        this.updateGraph(issueGraphData.components, issueGraphData.issues, this.projectIsNew);
                        this.projectIsNew = issueGraphData.components?.length === 0; // prevent not fully loaded states resetting this flag
                    });
            }
        } else {
            // only if project has not also changed
            if (changes.blacklistFilter != null) {
                const previous = changes.blacklistFilter.previousValue;
                if (
                    this.blacklistFilter[IssueType.BUG] != previous[IssueType.BUG]
                    || this.blacklistFilter[IssueType.FEATURE_REQUEST] != previous[IssueType.FEATURE_REQUEST]
                    || this.blacklistFilter[IssueType.UNCLASSIFIED] != previous[IssueType.UNCLASSIFIED]
                ) {
                    this.updateGraph(this.currentComponents, this.currentIssues, this.projectIsNew);
                }
            }
        }
    }

    updateGraph(components: ProjectComponent[], issues: IssuesState, shouldZoom: boolean=true) {
        const graph: GraphEditor = this.graph.nativeElement;
        let needRender = false;

        const interfacesToRemove = new Set<string>();
        graph.nodeList.forEach(node => {
            if (node.type === 'interface') {
                interfacesToRemove.add(node.id.toString());
            }
        });

        const edgesToRemove = new Set<string>();

        const issueGroupParents: Node[] = [];

        components.forEach(comp => {
            const componentNodeId = `component_${comp.id}`;
            let componentNode = graph.getNode(componentNodeId);
            if (componentNode == null) {
                const position: Point = this.nodePositions?.[componentNodeId] ?? {x: 0, y: 0};
                componentNode = {
                    id: componentNodeId,
                    ...position,
                    title: comp.name,
                    type: 'component',
                    data: comp,
                    relatedIssues: new Set<string>(),
                };
                graph.addNode(componentNode);
                this.addIssueGroupContainer(graph, componentNode);
                needRender = true;
            } else {
                if (componentNode.data !== comp) { // Identity comparison works becaus e of redux store
                    componentNode.title = comp.name;
                    componentNode.data = comp;
                    needRender = true;
                }
                graph.getEdgesBySource(componentNodeId).forEach(edge => edgesToRemove.add(edgeId(edge)));
                graph.getEdgesByTarget(componentNodeId).forEach(edge => edgesToRemove.add(edgeId(edge)));
            }
            this.updateIssuesForNode(graph, componentNode, comp.issues, issues);
            issueGroupParents.push(componentNode);
            Object.keys(comp.interfaces).forEach(interfaceId => {
                // mark interface as used
                interfacesToRemove.delete(interfaceId);

                const inter = comp.interfaces[interfaceId];
                const interfaceNodeId = `interface_${interfaceId}`;
                let interfaceNode = graph.getNode(interfaceNodeId);

                // mark interface edge as used
                const interfaceEdgeId = edgeId({
                    source: componentNodeId,
                    target: interfaceNodeId,
                });
                edgesToRemove.delete(interfaceEdgeId);

                if (interfaceNode == null) {
                    const position: Point = this.nodePositions?.[interfaceNodeId] ?? {x: 150, y: 0};
                    interfaceNode = {
                        id: interfaceNodeId,
                        ...position,
                        title: inter.interfaceName,
                        type: 'interface',
                        componentNodeId: componentNodeId,
                        data: inter,
                        relatedIssues: new Set<string>(),
                    };
                    graph.addNode(interfaceNode);
                    this.addIssueGroupContainer(graph, interfaceNode);
                    const edge = {
                        source: componentNodeId,
                        target: interfaceNodeId,
                        type: 'interface',
                        dragHandles: []
                    };
                    graph.addEdge(edge);
                    needRender = true;
                } else {
                    if (interfaceNode.data !== inter) { // Identity comparison works becaus e of redux store
                        interfaceNode.title = inter.interfaceName;
                        interfaceNode.data = inter;
                        needRender = true;
                    }
                }
                this.updateIssuesForNode(graph, interfaceNode, inter.issues, issues);
                issueGroupParents.push(interfaceNode);
            });
            comp.componentRelations.forEach(relation => {
                if (relation.targetType === 'component') {
                    const edge = {
                        source: componentNodeId,
                        target: `component_${relation.targetId}`,
                        type: 'component-connect',
                        markerEnd: {
                            template: 'arrow',
                            relativeRotation: 0,
                        }
                    };
                    const eId = edgeId(edge);
                    if (!edgesToRemove.has(eId)) {
                        graph.addEdge(edge);
                        needRender = true;
                    }
                    edgesToRemove.delete(eId);
                }
                if (relation.targetType === 'interface') {
                    const edge = {
                        source: componentNodeId,
                        target: `interface_${relation.targetId}`,
                        type: 'interface-connect',
                        markerEnd: {
                            template: 'interface-connector',
                            relativeRotation: 0,
                        }
                    };
                    const eId = edgeId(edge);
                    if (!edgesToRemove.has(eId)) {
                        graph.addEdge(edge);
                        needRender = true;
                    }
                    edgesToRemove.delete(eId);
                }
            });
        });

        edgesToRemove.forEach(eId => {
            const edge = graph.getEdge(eId);
            if (edge != null) { // FIXME after grapheditor update (just use the edge id in removeEdge)
                graph.removeEdge(edge);
            }
        });

        issueGroupParents.forEach(node => this.updateIssueRelations(graph, node, issues));

        this.issuesById = issues;

        if (true) {
            graph.completeRender();
            if (shouldZoom) {
                graph.zoomToBoundingBox();
            }
        }
    }

    private addIssueGroupContainer(graph: GraphEditor, node: Node) {
        const gm = graph.groupingManager;
        gm.markAsTreeRoot(node.id);
        graph.groupingManager.setGroupBehaviourOf(node.id, new IssueGroupContainerParentBehaviour());

        const issueGroupContainerNode = {
            id: `${node.id}__issue-group-container`,
            type: 'issue-group-container',
            dynamicTemplate: 'issue-group-container',
            x: 0,
            y: 0,
            position: 'bottom',
            issueGroupNodes: new Set<string>(),
        };
        graph.addNode(issueGroupContainerNode);
        gm.addNodeToGroup(node.id, issueGroupContainerNode.id);
        gm.setGroupBehaviourOf(issueGroupContainerNode.id, new IssueGroupContainerBehaviour());
    }

    private updateIssuesForNode(graph: GraphEditor, parentNode: Node, issueIds: string[], issues: IssuesState) {
        this.issueToRelatedNode.set(parentNode.id.toString(), new Set(issueIds));
        const issuesToAdd = new Set<string>();
        const issuesToRemove = new Set<string>(parentNode.relatedIssues);
        const issuesToUpdate = new Set<string>();
        issueIds.forEach(issueId => {
            if (issues[issueId] == null) {
                return;
            }
            const issue = issues[issueId];
            if (this.blacklistFilter[issue.type] ?? false) {
                return; // issue is filtered!
            }
            if (!this.issueToGraphNode.has(issueId)) {
                this.issueToGraphNode.set(issueId, new Set<string>());
            }
            if (issuesToRemove.has(issueId)) {
                issuesToUpdate.add(issueId);
            } else {
                issuesToAdd.add(issueId);
            }
            issuesToRemove.delete(issueId);
        });

        issuesToUpdate.forEach(issueId => this.updateIssueOfNode(graph, parentNode, issues[issueId]));

        issuesToAdd.forEach(issueId => this.addIssueToNode(graph, parentNode, issues[issueId]));
        issuesToRemove.forEach(issueId => this.removeIssueFromNode(graph, parentNode, issues[issueId]));
    }

    private updateIssueOfNode(graph: GraphEditor, parentNode: Node, issue: Issue) {
        let issueFolderId = `${parentNode.id}__undecided`;
        let issueType = 'issue-undecided';
        if (issue.type === IssueType.BUG) {
            issueFolderId = `${parentNode.id}__bug`;
            issueType = 'issue-bug';
        } else if (issue.type === IssueType.FEATURE_REQUEST) {
            issueFolderId = `${parentNode.id}__feature`;
            issueType = 'issue-feature';
        }

        let foundIssue = false;

        const gm = graph.groupingManager;
        const issueGroupContainer = graph.getNode(`${parentNode.id}__issue-group-container`);
        issueGroupContainer.issueGroupNodes.forEach(currentIssueFolderId => {
            const issueFolderNode = graph.getNode(currentIssueFolderId);
            if (issueFolderNode?.issues?.has(issue.id)) {
                if (issueFolderId === currentIssueFolderId) {
                    foundIssue = true;
                    return;
                }

                this.issueToGraphNode.get(issue.id).delete(currentIssueFolderId);
                issueFolderNode.issues.delete(issue.id);
                issueFolderNode.issueCount = issueFolderNode.issues.size > 99 ? '99+' : issueFolderNode.issues.size;
                if (issueFolderNode.issues.size === 0) {
                    gm.removeNodeFromGroup(issueGroupContainer.id, currentIssueFolderId);
                    graph.removeNode(issueFolderNode);
                }
            }
        });

        if (foundIssue) {
            return;
        }

        this.addIssueToNode(graph, parentNode, issue);
    }

    private addIssueToNode(graph: GraphEditor, parentNode: Node, issue: Issue) {
        let issueFolderId = `${parentNode.id}__undecided`;
        let issueType = 'issue-undecided';
        if (issue.type === IssueType.BUG) {
            issueFolderId = `${parentNode.id}__bug`;
            issueType = 'issue-bug';
        } else if (issue.type === IssueType.FEATURE_REQUEST) {
            issueFolderId = `${parentNode.id}__feature`;
            issueType = 'issue-feature';
        }

        const gm = graph.groupingManager;
        const issueGroupContainer = graph.getNode(`${parentNode.id}__issue-group-container`);
        let issueFolderNode = graph.getNode(issueFolderId);
        if (issueFolderNode == null) {
            issueFolderNode = {
                id: issueFolderId,
                type: issueType,
                x: 0,
                y: 0,
                issues: new Set<string>(),
                issueCount: 0,
            };
            graph.addNode(issueFolderNode);
            gm.addNodeToGroup(issueGroupContainer.id, issueFolderId);
        }
        issueFolderNode.issues.add(issue.id);
        parentNode.relatedIssues.add(issue.id);
        issueFolderNode.issueCount = issueFolderNode.issues.size > 99 ? '99+' : issueFolderNode.issues.size;


        this.issueToGraphNode.get(issue.id).add(issueFolderId);
    }

    private removeIssueFromNode(graph: GraphEditor, parentNode: Node, issue: Issue) {
        let issueFolderId = `${parentNode.id}__undecided`;
        let issueType = 'issue-undecided';
        if (issue.type === IssueType.BUG) {
            issueFolderId = `${parentNode.id}__bug`;
            issueType = 'issue-bug';
        } else if (issue.type === IssueType.FEATURE_REQUEST) {
            issueFolderId = `${parentNode.id}__feature`;
            issueType = 'issue-feature';
        }

        parentNode.relatedIssues.delete(issue.id);

        this.issueToGraphNode.get(issue.id).delete(issueFolderId);

        const gm = graph.groupingManager;
        const issueFolderNode = graph.getNode(issueFolderId);
        if (issueFolderNode != null) {
            issueFolderNode.issues.delete(issue.id);
            issueFolderNode.issueCount = issueFolderNode.issues.size > 99 ? '99+' : issueFolderNode.issues.size;
            if (issueFolderNode.issues.size === 0) {
                gm.removeNodeFromGroup(`${parentNode.id}__issue-group-container`, issueFolderId);
                graph.removeNode(issueFolderNode);
            }
        }
    }

    private updateIssueRelations(graph: GraphEditor, parentNode: Node, issues: IssuesState) {
        const issueGroupContainer = graph.getNode(`${parentNode.id}__issue-group-container`);
        if (issueGroupContainer.issueGroupNodes.size === 0) {
            return;
        }

        issueGroupContainer.issueGroupNodes.forEach(issueFolderId => {
            const issueFolderNode = graph.getNode(issueFolderId);
            const edgesToDelete = new Set<string>();
            graph.getEdgesBySource(issueFolderId).forEach(edge => {
                edgesToDelete.add(edgeId(edge));
                // TODO reset sets
                edge.sourceIssues?.clear();
            });

            issueFolderNode.issues.forEach(issueId => {
                const issue = issues[issueId];

                if (issue == null) {
                    return; // should not happen but just to be safe
                }

                issue.relatedIssues.forEach(rel => {
                    this.issueToGraphNode.get(rel.relatedIssueId).forEach(targetNodeId => {

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

            edgesToDelete.forEach(edgeId => {
                const edge = graph.getEdge(edgeId);
                if (edge) { // FIXME after grapheditor update (just use the edgeId in removeEdge)
                    graph.removeEdge(edge);
                }
            });
        });
    }

    private onCreateEdge = (edge: DraggedEdge) => {
        const graph: GraphEditor = this.graph.nativeElement;
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
            graph.nodeList.forEach(node => {
                if (node.type === 'interface') {
                    edge.validTargets.add(node.id.toString());
                }
            });
            // allow only new targets
            graph.getEdgesBySource(sourceNode.id).forEach(existingEdge => {
                edge.validTargets.delete(existingEdge.target.toString());
            });
        }
        return edge;
    }

    private onDraggedEdgeTargetChanged = (edge: DraggedEdge, sourceNode: Node, targetNode: Node) => {
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
            const graph: GraphEditor = this.graph.nativeElement;
            const sourceNode = graph.getNode(edge.source);
            const targetNode = graph.getNode(edge.target);
            if (sourceNode != null && targetNode != null) {
                this.api.addComponentToInterfaceRelation(sourceNode.data.id, targetNode.data.id);
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
            this.addInterfaceToComponent(event.detail.sourceNode.data.id);
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
            const graph: GraphEditor = this.graph.nativeElement;
            const sourceNode = graph.getNode(edge.source);
            const targetNode = graph.getNode(edge.target);
            if (sourceNode != null && targetNode != null) {
                this.api.removeComponentToInterfaceRelation(sourceNode.data.id, targetNode.data.id);
            }
        }
    }

    private onNodeClick = (event: CustomEvent) => {
        event.preventDefault(); // prevent node selection
        const node = event.detail.node;

        if (node.type === 'component') {
            // TODO show a edit component dialog (or similar)
            this.bottomSheet.open(GraphNodeInfoSheetComponent, {
                data: {
                    projectId: this.project.id,
                    component: node.data,
                    issues: [...node.relatedIssues],
                }
            });
            return;
        }
        if (node.type === 'interface') {
            const graph: GraphEditor = this.graph.nativeElement;
            const componentNode = graph.getNode(node.componentNodeId);
            // TODO show a edit interface dialog (or similar)
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
        }
        if (node.type.startsWith('issue-')) {
            const graph: GraphEditor = this.graph.nativeElement;
            const rootId = graph.groupingManager.getTreeRootOf(node.id);
            const rootNode = graph.getNode(rootId);

            if (rootNode.type === 'component') {
                // TODO show a edit component dialog (or similar)
                this.bottomSheet.open(GraphNodeInfoSheetComponent, {
                    data: {
                        projectId: this.project.id,
                        component: rootNode.data,
                        issues: [...node.issues],
                    }
                });
                return;
            }

            if (rootNode.type === 'interface') {
                const graph: GraphEditor = this.graph.nativeElement;
                const componentNode = graph.getNode(node.componentNodeId);
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
                return;
            }
            return;
        }
        console.log('Clicked on another type of node:', node);
    }

    private loadProjectSettings(projectId: string) {
        const key = `MPMTI-Project_${projectId}`;
        if (projectId != null) {
            const data = localStorage.getItem(key);
            if (data != null && data !== '') {
                this.nodePositions = JSON.parse(data);
            } else {
                this.nodePositions = {};
            }
            this.saveNodePositionsSubscription = this.saveNodePositionsSubject.pipe(
                debounceTime(300)
            ).subscribe(() => {
                if (projectId !== this.project?.id) {
                    return;
                }
                if (this.nodePositions != null) {
                    const newData = JSON.stringify(this.nodePositions);
                    localStorage.setItem(key, newData);
                }
            });
        } else {
            this.nodePositions = {};
        }

        this.issuesById = {};
        this.issueToRelatedNode = new Map();
        this.issueToGraphNode = new Map();
    }

    private addInterfaceToComponent(componentId) {
        const createComponentDialog = this.dialog.open(CreateInterfaceDialogComponent);

        createComponentDialog.afterClosed().subscribe((interfaceName: string) => {
            if (interfaceName != null && interfaceName !== '') {
                this.api.addComponentInterface(componentId, interfaceName);
            }
        });
    }
}
