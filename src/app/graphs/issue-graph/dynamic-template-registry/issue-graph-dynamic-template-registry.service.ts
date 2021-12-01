import {Injectable} from '@angular/core';
import * as dynamicTemplate from '@ustutt/grapheditor-webcomponent/lib/dynamic-templates/dynamic-template';
import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor';
import {LinkHandle} from '@ustutt/grapheditor-webcomponent/lib/link-handle';
import {Node} from '@ustutt/grapheditor-webcomponent/lib/node';

/**
 * This service is responsible for managing the dynamic template registry
 * of a given GraphEditor instance.
 * Used in method initGraph of IssueGraphComponent.
 */
@Injectable({
  providedIn: 'root'
})
export class IssueGraphDynamicTemplateRegistryService {
  /**
   * Manages the dynamic template registry of given GraphEditor instance.
   * @param graph Reference to the GraphEditor instance of the graph that is handled.
   */
  manageDynamicTemplateRegistry(graph: GraphEditor): void {
    graph.dynamicTemplateRegistry.addDynamicTemplate('issue-group-container', {
      renderInitialTemplate(g, grapheditor: GraphEditor, context: dynamicTemplate.DynamicTemplateContext<Node>): void {
        // template is empty
        g.append('circle').attr('x', 0).attr('y', 0).attr('r', 1).style('opacity', 0);
      },
      updateTemplate(g, grapheditor: GraphEditor, context: dynamicTemplate.DynamicTemplateContext<Node>): void {
        // template is empty
      },
      getLinkHandles(g, grapheditor: GraphEditor): LinkHandle[] {
        // template has no link handles
        return [];
      }
    } as dynamicTemplate.DynamicNodeTemplate);
  }
}
