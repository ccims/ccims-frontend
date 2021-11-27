import {Injectable} from '@angular/core';
import {Edge} from '@ustutt/grapheditor-webcomponent/lib/edge';
import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor';
import {Node} from '@ustutt/grapheditor-webcomponent/lib/node';

/**
 * This service is respoonsible for managing the class setters
 * of a given GraphEditor instance.
 * Used in method initGraph of IssueGraphComponent.
 */
@Injectable({
  providedIn: 'root'
})
export class IssueGraphClassSettersService {
  /**
   * Manages node / edge class setters so that node / edge classes
   * of given GraphEditor instances match their corresponding class names.
   * The setters return true if the class name is applied to the corresponding node / edge.
   * They are called on all nodes, pairs of edges and class names.
   * @param  {GraphEditor} graph - Reference to the GraphEditor instance of the graph that is handled.
   * @param  {GraphEditor} minimap - Reference to the GraphEditor instance of the minimap that is handled.
   */
  manageClassSetters(graph: GraphEditor, minimap: GraphEditor) {
    // node class setter
    const nodeClassSetter = (className: string, node: Node) => {
      if (className === node.type) {
        return true;
      }
      return false;
    };

    // applies noce class setter
    graph.setNodeClass = nodeClassSetter;
    minimap.setNodeClass = nodeClassSetter;

    // edge class setter
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

    // applies edge class setter
    graph.setEdgeClass = edgeClassSetter;
    minimap.setEdgeClass = edgeClassSetter;
  }
}
