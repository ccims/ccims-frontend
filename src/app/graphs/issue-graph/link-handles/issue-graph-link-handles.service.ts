import { Injectable } from '@angular/core';
import { DraggedEdge, Edge } from '@ustutt/grapheditor-webcomponent/lib/edge';
import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor';
import { LinkHandle } from '@ustutt/grapheditor-webcomponent/lib/link-handle';
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';

/**
 * This service is respoonsible for managing the link handles
 * of a given GraphEditor instance.
 * Used in method initGraph of IssueGraphComponent.
 */
@Injectable({
  providedIn: 'root',
})
export class IssueGraphLinkHandlesService {
  /**
   * Manages calculation of the link handles of given GraphEditor instances.
   * @param  {GraphEditor} graph - Reference to the GraphEditor instance of the graph that is handled.
   * @param  {GraphEditor} minimap - Reference to the GraphEditor instance of the minimap that is handled.
   */
  manageLinkHandles(graph: GraphEditor, minimap: GraphEditor) {
    // calculation for link handles
    const linkHandleCalculation = (
      edge: Edge | DraggedEdge,
      sourceHandles: LinkHandle[],
      source: Node,
      targetHandles: LinkHandle[],
      target: Node
    ) => {
      // handles at the source / target of a given edge
      const handles = {
        sourceHandles,
        targetHandles,
      };

      // case: source of edge has allowed anchors
      // => calculates source handles
      if (source?.allowedAnchors != null) {
        this.calculateSourceHandles(source, handles, sourceHandles);
      }

      // case: target of edge has allowed anchors
      // => calculates target handles
      if (target?.allowedAnchors != null) {
        this.calculateTargetHandles(target, handles, targetHandles);
      }

      return handles;
    };

    // applies calculaiton for link handles
    graph.calculateLinkHandlesForEdge = linkHandleCalculation;
    minimap.calculateLinkHandlesForEdge = linkHandleCalculation;
  }

  /**
   * Calculates the source handles of a given edge.
   * @param  {Node} source - Source of the edge that is handled.
   * @param  {{sourceHandles:LinkHandle[];targetHandles:LinkHandle[];}} handles - Handles of the edge.
   * @param  {LinkHandle[]} sourceHandles - Source handles of the edge.
   */
  private calculateSourceHandles(
    source: Node,
    handles: { sourceHandles: LinkHandle[]; targetHandles: LinkHandle[] },
    sourceHandles: LinkHandle[]
  ) {
    handles.sourceHandles = sourceHandles.filter((linkHandle) => {
      // case: X coordinate of link handle further than the Y coordinate
      if (Math.abs(linkHandle.x) > Math.abs(linkHandle.y)) {
        if (linkHandle.x > 0 && source.allowedAnchors.has('right')) {
          return true;
        }
        if (linkHandle.x < 0 && source.allowedAnchors.has('left')) {
          return true;
        }
      }

      // case: X coordinate of link handle as close as / closer than the Y coordinate
      else {
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

  /**
   * Calculates the target handles of a given edge.
   * @param  {Node} target - Target of the edge that is handled.
   * @param  {{sourceHandles:LinkHandle[];targetHandles:LinkHandle[];}} handles - Handles of the edge.
   * @param  {LinkHandle[]} targetHandles - Target handles of the edge.
   */
  private calculateTargetHandles(
    target: Node,
    handles: { sourceHandles: LinkHandle[]; targetHandles: LinkHandle[] },
    targetHandles: LinkHandle[]
  ) {
    handles.targetHandles = targetHandles.filter((linkHandle) => {
      // case: X coordinate of link handle further than the Y coordinate
      if (Math.abs(linkHandle.x) > Math.abs(linkHandle.y)) {
        if (linkHandle.x > 0 && target.allowedAnchors.has('right')) {
          return true;
        }
        if (linkHandle.x < 0 && target.allowedAnchors.has('left')) {
          return true;
        }
      }

      // case: X coordinate of link handle as close as / closer than the Y coordinate
      else {
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
}
