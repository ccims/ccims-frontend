import {NodeType} from '@app/graphs/issue-graph/issue-graph-nodes';

class Vector {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public static isBehind(source: Vector, target: Vector, point: Vector): boolean {
    const srcToTarget = target.subtract(source);
    const srcToPoint = point.subtract(source);
    return srcToTarget.dot(srcToPoint) < 0 || srcToTarget.isZero();
  }

  public scale(factor: number): Vector {
    return new Vector(this.x * factor, this.y * factor);
  }

  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public normalize(): Vector {
    return this.scale(1 / this.length());
  }

  public add(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  public addSelf(other: Vector): Vector {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  public subtract(other: Vector): Vector {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  public perpendicularClockwise(): Vector {
    return new Vector(this.y, -this.x);
  }

  public perpendicularCounterClockwise(): Vector {
    return new Vector(-this.y, this.x);
  }

  public dot(other: Vector): number {
    return this.x * other.x + this.y * other.y;
  }

  public distanceToLine(sourcePoint: Vector, targetPoint: Vector): number {
    const length = targetPoint.subtract(sourcePoint).length();
    return Math.abs((targetPoint.x - sourcePoint.x) * (sourcePoint.y - this.x) -
      (sourcePoint.x - this.x) * (targetPoint.y - sourcePoint.y)) / length;
  }

  public isZero(): boolean {
    return this.x === 0 && this.y === 0;
  }
}

export class LayoutNode {
  static readonly MIN_DISTANCE_NOT_CONNECTED = 80;
  static readonly MAX_DISTANCE_CONNECTED = 80;
  static readonly MIN_DISTANCE_CONNECTED = 20;
  static readonly MIN_DISTANCE_EDGE = 60;
  static readonly PADDING_COMPONENT = 50;
  static readonly PADDING_INTERFACE = 5;

  readonly id: string | number;
  public position: Vector;
  public fixed = false;
  private connectedTo: Set<LayoutNode> = new Set<LayoutNode>();
  readonly padding: number;

  constructor(id: string | number, positionX: number, positionY: number, nodeType: NodeType) {
    this.id = id;
    this.padding = nodeType === NodeType.Component ? LayoutNode.PADDING_COMPONENT : LayoutNode.PADDING_INTERFACE;
    this.position = new Vector(positionX, positionY);
  }

  public connectTo(other: LayoutNode): void {
    this.connectedTo.add(other);
  }

  public calculateMovement(allNodes: Array<LayoutNode>): Vector {
    const result = new Vector();
    const otherNodesVisited = new Set<string | number>();

    for (const otherNode of allNodes) {
      if (otherNode.id === this.id) {
        continue;
      }

      let towardsOther = otherNode.position.subtract(this.position);
      if (towardsOther.isZero()) {
        this.position.x += Math.random() - .5;
        this.position.y += Math.random() - .5;
        towardsOther = otherNode.position.subtract(this.position);
      }

      const pad = this.padding + otherNode.padding;
      const distance = Math.max(1, towardsOther.length() - pad);
      towardsOther = towardsOther.scale(1 / distance);

      let scale = 0;
      if (distance < LayoutNode.MIN_DISTANCE_CONNECTED) {
        // Connected nodes have a minimum distance to each other
        result.addSelf(towardsOther.scale(-Math.max(LayoutNode.MIN_DISTANCE_CONNECTED - distance, 0)));
      } else {
        if (this.connectedTo.has(otherNode)) {
          // Node attracted to connected nodes
          scale = Math.max(distance - LayoutNode.MAX_DISTANCE_CONNECTED, 0);
        } else {
          // Node repelled by non-connected nodes
          scale = -Math.max(LayoutNode.MIN_DISTANCE_NOT_CONNECTED - distance, 0);
        }
        result.addSelf(towardsOther.scale(scale));
      }

      for (const edgeNode of otherNode.connectedTo) {
        if (edgeNode.id === this.id || (otherNodesVisited.has(otherNode.id) && otherNodesVisited.has(edgeNode.id))) {
          continue;
        }

        otherNodesVisited.add(edgeNode.id).add(otherNode.id);

        if (Vector.isBehind(otherNode.position, edgeNode.position, this.position) ||
          Vector.isBehind(edgeNode.position, otherNode.position, this.position)) {
          continue;
        }

        const distanceToEdge = Math.max(1, this.position.distanceToLine(otherNode.position, edgeNode.position) - pad);
        if (distanceToEdge < LayoutNode.MIN_DISTANCE_EDGE) {
          const edge = edgeNode.position.subtract(otherNode.position);
          const point = this.position.subtract(otherNode.position);
          scale = -Math.max(LayoutNode.MIN_DISTANCE_EDGE - distanceToEdge, 0);

          // Always point away from edge
          if (edge.x * -point.y + edge.y * point.x < 0) {
            result.addSelf(edge.normalize().perpendicularClockwise().scale(scale));
          } else {
            result.addSelf(edge.normalize().perpendicularCounterClockwise().scale(scale));
          }
        }
      }
    }

    return result;
  }
}

export function doGraphLayout(nodes: Array<LayoutNode>): void {
  if (nodes.length === 0) {
    return;
  }

  const directions = new Array<Vector>(nodes.length);
  const firstNode = nodes[0];
  firstNode.fixed = true;

  // FIXME: This loop should stop early if no more changes happen
  for (let v = 0; v < 4000; ++v) {
    for (let i = 0; i < nodes.length; ++i) {
      const node = nodes[i];
      if (!node.fixed) {
        directions[i] = node.calculateMovement(nodes);
      }
    }

    for (let i = 0; i < nodes.length; ++i) {
      const node = nodes[i];
      if (!node.fixed) {
        node.position = node.position.add(directions[i].scale(.1));
      }
    }
  }
}
