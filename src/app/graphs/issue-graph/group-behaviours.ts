import { GroupBehaviour } from "@ustutt/grapheditor-webcomponent/lib/grouping";
import { Point } from '@ustutt/grapheditor-webcomponent/lib/edge';
import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor';
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';

function distance(x, y, x2, y2) {
    return ((x - x2) ** 2) + ((y - y2) ** 2);
}

export class IssueGroupContainerParentBehaviour implements GroupBehaviour {
    moveChildrenAlongGoup = true;
    childNodePositions = new Map();

    beforeNodeMove(group: string, childGroup: string, groupNode: Node, childNode: Node, newPosition: Point, graphEditor: GraphEditor) {
        // calculate groupNode (the parent node) dimensions
        const width = groupNode.type === 'interface' ? 10 : 100;
        const height = groupNode.type === 'interface' ? 10 : 60;
        // find nearest side
        let best = 'bottom';
        if (newPosition != null && (newPosition.x !== 0 || newPosition.y !== 0)) {
            let bestDistance = distance(newPosition.x, newPosition.y, groupNode.x, groupNode.y + (height / 2) + 25);
            const rightDistance = distance(newPosition.x, newPosition.y, groupNode.x + (width / 2) + 30, groupNode.y);
            const leftDistance = distance(newPosition.x, newPosition.y, groupNode.x - (width / 2) - 30, groupNode.y);
            const topDistance = distance(newPosition.x, newPosition.y, groupNode.x, groupNode.y - (height / 2) - 25);
            if (rightDistance < bestDistance) {
                bestDistance = rightDistance;
                best = 'right';
            }
            if (leftDistance < bestDistance) {
                bestDistance = leftDistance;
                best = 'left';
            }
            if (topDistance < bestDistance) {
                bestDistance = topDistance;
                best = 'top';
            }
        }
        // set position
        if (best === 'bottom') {
            this.childNodePositions.set(childGroup, {x: 0, y: (height / 2) + 25});
            if (childNode != null && (newPosition == null || (newPosition.x === 0 && newPosition.y === 0))) {
                childNode.x = groupNode.x;
                childNode.y = groupNode.y + (height / 2) + 25;
            }
        }
        if (best === 'top') {
            this.childNodePositions.set(childGroup, {x: 0, y: -(height / 2) - 25});
            if (childNode != null && (newPosition == null || (newPosition.x === 0 && newPosition.y === 0))) {
                childNode.x = groupNode.x;
                childNode.y = groupNode.y - (height / 2) - 25;
            }
        }
        if (best === 'right') {
            this.childNodePositions.set(childGroup, {x: (width / 2) + 30, y: 0});
            if (childNode != null && (newPosition == null || (newPosition.x === 0 && newPosition.y === 0))) {
                childNode.x = groupNode.x + (width / 2) + 30;
                childNode.y = groupNode.y;
            }
        }
        if (best === 'left') {
            this.childNodePositions.set(childGroup, {x: -(width / 2) - 30, y: 0});
            if (childNode != null && (newPosition == null || (newPosition.x === 0 && newPosition.y === 0))) {
                childNode.x = groupNode.x - (width / 2) - 30;
                childNode.y = groupNode.y;
            }
        }
        if (childNode != null) {
            childNode.position = best;
            const containerBehaviour = graphEditor.groupingManager.getGroupBehaviourOf(childGroup) as IssueGroupContainerBehaviour;
            containerBehaviour?.relativePositionChanged?.(childGroup, childNode, graphEditor);
        }
    }
}

export class IssueGroupContainerBehaviour implements GroupBehaviour {
    captureChildMovement = true;
    moveChildrenAlongGoup = true;
    childNodePositions = new Map();

    relativePositionChanged(group: string, groupNode: Node, graphEditor: GraphEditor) {
        const parent = graphEditor.groupingManager.getTreeParentOf(group);
        const children = graphEditor.groupingManager.getChildrenOf(group);

        const places = children.size - 1;
        const startOffset = places > 0 ? (places / 2) : 0;
        let xOffset = 0;
        let yOffset = 0;

        if (groupNode.position === 'bottom' || groupNode.position === 'top') {
            xOffset = startOffset * 45;
        }
        if (groupNode.position === 'right' || groupNode.position === 'left') {
            yOffset = -startOffset * 35;
        }

        // pre sorted list
        const sortedChildIds = [
            `${parent}__undecided`,
            `${parent}__bug`,
            `${parent}__feature`,
        ].filter(childId => children.has(childId));
        sortedChildIds.forEach((childId, index) => {
            this.childNodePositions.set(childId, {x: xOffset, y: yOffset});
            const child = graphEditor.getNode(childId);
            if (child != null) {
                child.x = groupNode.x + xOffset;
                child.y = groupNode.y + yOffset;
            }
            if (groupNode.position === 'bottom' || groupNode.position === 'top') {
                xOffset -= 45;
            }
            if (groupNode.position === 'right' || groupNode.position === 'left') {
                yOffset += 35;
            }
            // set allowed link anchors
            const allowedAnchors = new Set<string>();
            allowedAnchors.add(groupNode.position);
            if (index === 0) {
                if (groupNode.position === 'bottom' || groupNode.position === 'top') {
                    allowedAnchors.add('right');
                }
                if (groupNode.position === 'right' || groupNode.position === 'left') {
                    allowedAnchors.add('top');
                }
            }
            if (index === (sortedChildIds.length - 1)) {
                if (groupNode.position === 'bottom' || groupNode.position === 'top') {
                    allowedAnchors.add('left');
                }
                if (groupNode.position === 'right' || groupNode.position === 'left') {
                    allowedAnchors.add('bottom');
                }
            }
            const childNode = graphEditor.getNode(childId);
            if (childNode != null) {
                childNode.allowedAnchors = allowedAnchors;
            }
        });
    }

    afterNodeJoinedGroup(group: string, childGroup: string, groupNode: Node, childNode: Node, graphEditor: GraphEditor) {
        this.relativePositionChanged(group, groupNode, graphEditor);
        groupNode.issueGroupNodes?.add(childGroup);
    }

    afterNodeLeftGroup(group: string, childGroup: string, groupNode: Node, childNode: Node, graphEditor: GraphEditor) {
        this.relativePositionChanged(group, groupNode, graphEditor);
        groupNode.issueGroupNodes?.delete(childGroup);
    }
}
