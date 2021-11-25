import { NodeType } from '@app/graphs/issue-graph/issue-graph-nodes';

/**
 * A simple 2D vector class.
 * The value of this vector is essentially immutable, every operation returns a new vector!
 */
class Vector {
  public x: number;
  public y: number;

  /**
   * Vector constructor
   * @param x X component, 0 by default
   * @param y Y component, 0 by default
   */
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Check if the vector pointing from `source` to `point` is pointing away more than 90 degrees to the vector pointing
   * from the `source` to the `target`.
   * @param source The source point, as a vector
   * @param target The target point, as a vector
   * @param point The point to check, as a vector
   * @return dot(target - source, point - source) < 0
   */
  public static isBehind(
    source: Vector,
    target: Vector,
    point: Vector
  ): boolean {
    const srcToTarget = target.subtract(source);
    const srcToPoint = point.subtract(source);
    return srcToTarget.dot(srcToPoint) < 0 || srcToTarget.isZero();
  }

  /**
   * Scale the vector
   * @param factor The scalar
   * @returns A new, scaled vector
   */
  public scale(factor: number): Vector {
    return new Vector(this.x * factor, this.y * factor);
  }

  /**
   * Length of the vector
   */
  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Normalize the vector
   * @returns A new, normalized vector
   */
  public normalize(): Vector {
    return this.scale(1 / this.length());
  }

  /**
   * Add this vector and another vector
   * @param other The other vector
   * @returns A new vector, the sum of this vector and the other vector
   */
  public add(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  /**
   * Add another vector on *this* vector
   * @param other The other vector
   * @returns This vector
   */
  public addSelf(other: Vector): Vector {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  /**
   * Subtract this vector and another vector
   * @param other The other vector
   * @returns A new vector, the difference of this vector and the other vector
   */
  public subtract(other: Vector): Vector {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  /**
   * Rotate this vector by 90 degrees in the clockwise direction
   * @returns A new, rotated vector
   */
  public perpendicularClockwise(): Vector {
    return new Vector(this.y, -this.x);
  }

  /**
   * Rotate this vector by 90 degrees in the counter-clockwise direction
   * @returns A new, rotated vector
   */
  public perpendicularCounterClockwise(): Vector {
    return new Vector(-this.y, this.x);
  }

  /**
   * Calculate the dot product
   * @param other The other vector
   * @returns dot(this, other)
   */
  public dot(other: Vector): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Calculate the distance of a point, as represented by this vector, to a line, as defined by two other points.
   * Note that the length of the line is infinite, and that this function calculates the distance to this infinitely
   * long line.
   * If this is not desired, the {@link #isBehind} function can be used to determine if a point is outside the defined
   * line segment.
   * @param sourcePoint The source point of the line
   * @param targetPoint The target point of the line
   * @returns The distance to the infinitely long line
   */
  public distanceToLine(sourcePoint: Vector, targetPoint: Vector): number {
    const length = targetPoint.subtract(sourcePoint).length();
    return (
      Math.abs(
        (targetPoint.x - sourcePoint.x) * (sourcePoint.y - this.y) -
          (sourcePoint.x - this.x) * (targetPoint.y - sourcePoint.y)
      ) / length
    );
  }

  /**
   * Check if both components of this vector are zero
   * @returns True if it is zero
   */
  public isZero(): boolean {
    return this.x === 0 && this.y === 0;
  }
}

/**
 * This class is an abstract representation of a node in a graph
 */
export class LayoutNode {
  /** The minimum spacing between two nodes if they are not connected by an edge */
  static readonly MIN_DISTANCE_NOT_CONNECTED = 80;

  /** The maximum spacing between two nodes if they are connected by an edge */
  static readonly MAX_DISTANCE_CONNECTED = 80;

  /** The minimum spacing between two nodes if they are connected by an edge */
  static readonly MIN_DISTANCE_CONNECTED = 20;

  /** The minimum spacing between a node and an edge */
  static readonly MIN_DISTANCE_EDGE = 60;

  /** The padding around a component node */
  static readonly PADDING_COMPONENT = 50;

  /** The padding around an interface node */
  static readonly PADDING_INTERFACE = 5;

  /** Node id */
  readonly id: string | number;

  /** Position of this node */
  public position: Vector;

  /** If true, this node will not move under any circumstance */
  public fixed = false;

  /** Set of edges this node is connected to  */
  private connectedTo: Set<LayoutNode> = new Set<LayoutNode>();

  /** Padding to be added to this node */
  readonly padding: number;

  constructor(
    id: string | number,
    positionX: number,
    positionY: number,
    nodeType: NodeType
  ) {
    this.id = id;
    this.padding =
      nodeType === NodeType.Component
        ? LayoutNode.PADDING_COMPONENT
        : LayoutNode.PADDING_INTERFACE;
    this.position = new Vector(positionX, positionY);
  }

  /**
   * Create an edge between this node and another node.
   * Does **not** create a connection from the other node to this node!
   * @param other The other node
   */
  public connectTo(other: LayoutNode): void {
    this.connectedTo.add(other);
  }

  /**
   * Calculate the movement direction that this node should move in, based on all other nodes around it
   * @param allNodes All nodes, can include this node as well
   * @returns The direction in which this node wants to travel
   */
  public calculateMovement(allNodes: Array<LayoutNode>): Vector {
    if (this.fixed) {
      return new Vector();
    }

    // Total force acting on this node
    const result = new Vector();

    // Keeps track of edges already visited
    const otherNodesVisited = new Set<string | number>();

    for (const otherNode of allNodes) {
      // Iterate over all other nodes
      if (otherNode.id === this.id) {
        continue;
      }

      // If both nodes are at an identical position, add a small randomized offset to this nodes position
      let towardsOther = otherNode.position.subtract(this.position);
      if (towardsOther.isZero()) {
        this.position.x += Math.random() - 0.5;
        this.position.y += Math.random() - 0.5;
        towardsOther = otherNode.position.subtract(this.position);
      }

      const pad = this.padding + otherNode.padding;
      const distance = Math.max(1, towardsOther.length() - pad);
      towardsOther = towardsOther.scale(1 / distance);

      // Move this node towards connected nodes, and away from non-connected nodes.
      // Also make sure that a minimum spacing between nodes exists, regardless of connection.
      let scale = 0;
      if (this.connectedTo.has(otherNode)) {
        if (distance < LayoutNode.MIN_DISTANCE_CONNECTED) {
          // Connected nodes have a minimum distance to each other
          scale = -Math.max(LayoutNode.MIN_DISTANCE_CONNECTED - distance, 0);
        } else {
          // Node attracted to connected nodes
          scale = Math.max(distance - LayoutNode.MAX_DISTANCE_CONNECTED, 0);
        }
      } else {
        // Node repelled by non-connected nodes
        scale = -Math.max(LayoutNode.MIN_DISTANCE_NOT_CONNECTED - distance, 0);
      }

      // Add this to the total force
      result.addSelf(towardsOther.scale(scale));

      // Now make this node repel from edges connecting nodes
      for (const edgeNode of otherNode.connectedTo) {
        // Ignore edges that were already visited
        if (
          edgeNode.id === this.id ||
          (otherNodesVisited.has(otherNode.id) &&
            otherNodesVisited.has(edgeNode.id))
        ) {
          continue;
        }

        otherNodesVisited.add(edgeNode.id).add(otherNode.id);

        // Check if this node is next to the edge connecting two nodes
        if (
          Vector.isBehind(
            otherNode.position,
            edgeNode.position,
            this.position
          ) ||
          Vector.isBehind(edgeNode.position, otherNode.position, this.position)
        ) {
          continue;
        }

        // If this is the case, determine the distance of the node to the edge, and if necessary, add a force pointing
        // away from the edge
        const distanceToEdge = Math.max(
          1,
          this.position.distanceToLine(otherNode.position, edgeNode.position) -
            pad
        );
        if (distanceToEdge < LayoutNode.MIN_DISTANCE_EDGE) {
          const edge = edgeNode.position.subtract(otherNode.position);
          const point = this.position.subtract(otherNode.position);
          scale = Math.max(LayoutNode.MIN_DISTANCE_EDGE - distanceToEdge, 0);

          // Always point away from edge
          if (edge.x * -point.y + edge.y * point.x < 0) {
            result.addSelf(
              edge.normalize().perpendicularCounterClockwise().scale(scale)
            );
          } else {
            result.addSelf(
              edge.normalize().perpendicularClockwise().scale(scale)
            );
          }
        }
      }
    }

    return result;
  }
}

/**
 * Automatically lay out the provided nodes.
 * @param nodes All nodes that are to be laid-out
 */
export function doGraphLayout(nodes: Array<LayoutNode>): void {
  if (nodes.length === 0) {
    return;
  }

  const directions = new Array<Vector>(nodes.length);
  // Fix an arbitrary node in place to prevent the graph from flying away
  const firstNode = nodes[0];
  firstNode.fixed = true;

  // FIXME: This loop should stop early if no more (significant) changes happen
  for (let v = 0; v < 4000; ++v) {
    // Calculate all forces
    for (let i = 0; i < nodes.length; ++i) {
      const node = nodes[i];
      if (!node.fixed) {
        directions[i] = node.calculateMovement(nodes);
      }
    }

    // Move nodes
    for (let i = 0; i < nodes.length; ++i) {
      const node = nodes[i];
      if (!node.fixed) {
        node.position = node.position.add(directions[i].scale(0.1));
      }
    }
  }
}
