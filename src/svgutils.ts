import { Transform2d, Vec2 } from "@repcomm/scenario2d";

export const SVGPathDCommands = "MLQTCSAZVHmlqtcsazvh";

export interface PathRect {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

/**A single command in a set of svg path d commands
 * also contains the points that make it up
 * Note: When accessing a V or H command, the full coordinate is stored
 * you should be safe to use it
 */
export class PathCmd {
  private type: string;
  private points: Array<Vec2>;

  constructor() {
    this.points = new Array();
  }
  setType(type: string): this {
    this.type = type;
    return this;
  }
  getType(): string {
    return this.type;
  }
  addPoint(v: Vec2): this {
    this.points.push(v);
    return this;
  }
  getPoints(): Array<Vec2> {
    return this.points;
  }
  getPointCount(): number {
    return this.points.length;
  }
  getPoint(ind: number): Vec2 {
    return this.points[ind];
  }
  getFirstPoint(): Vec2 {
    return this.points[0];
  }
  getLastPoint(): Vec2 {
    return this.points[this.points.length - 1];
  }
  toString(): string {
    let result = this.type;
    if (this.getType() == "V") {
      result += ` ${this.points[0].y}`;
    } else if (this.getType() == "H") {
      result += ` ${this.points[0].x}`;
    } else {
      for (let p of this.points) {
        result += ` ${p.x},${p.y}`;
      }
    }
    return result;
  }
  /**Returns true if the coordinates are in absolute space
   * false if relative space
   * Relies on svg path d lowercase / uppercase syntax
   */
  isAbsolute(): boolean {
    return this.type !== this.type.toLowerCase();
  }
  /**svg path d commands generate an offset
   * when they specify points
   * Absolute commands generate on offset equal to their last point
   * Relative commands generate on offset defined as:
   * command m -> first point + last point
   * command <other> -> not tested
   */
  getGeneratedOffset(): Vec2 {
    let result = new Vec2();
    if (this.getType() == "z" || this.getType() == "Z") return result;
    if (this.isAbsolute()) {
      result.copy(this.getLastPoint());
    } else {
      result.copy(this.getFirstPoint());

      if (this.getPointCount() > 1) {
        result.add(this.getLastPoint());
      }
    }
    return result;
  }
}

/**A helper class for SVG paths modification / info
 * Spawn one by PathHelper.from ( dAttribute );
 * where dAttribute is the d attribute of an svg path element
 */
export class PathHelper {
  private commands: Array<PathCmd>;
  constructor() {
    this.commands = new Array();
  }
  /**Parses an svg path data attribute
   * @param d 
   */
  static from(d: string): PathHelper {
    let chunks: Array<string> = d.split(" ");
    let args: Array<string>;

    let result = new PathHelper();

    let cmd: PathCmd;
    let point: Vec2;
    let lastPoint = new Vec2();

    for (let chunk of chunks) {
      if (SVGPathDCommands.includes(chunk)) {
        cmd = new PathCmd().setType(chunk);
        result.commands.push(cmd);
        continue;
      }
      //H and V only have 1 number argument, so complete the second with previous point
      if (cmd.getType() == "H") {
        point = new Vec2().set(
          parseFloat(chunk),
          lastPoint.getY()
        );
        cmd.addPoint(point);
      } else if (cmd.getType() == "V") {
        point = new Vec2().set(
          lastPoint.getX(),
          parseFloat(chunk)
        );
        cmd.addPoint(point);
      } else {
        args = chunk.split(",");
        if (args.length % 2 !== 0) throw `Got odd amount of arguments ${cmd.getType()} ${chunk}`;
        for (let i = 0; i < args.length; i += 2) {
          point = new Vec2().set(
            parseFloat(args[i]),
            parseFloat(args[i + 1])
          );
          cmd.addPoint(point);
        }
      }

      lastPoint.copy(point);
    }

    return result;
  }
  /**Return a list of all the path commands
   * Each command contains its point arguments (numbers list) as Vec2
   */
  getCommands(): Array<PathCmd> {
    return this.commands;
  }
  /**Get all the points from all the commands
   * @param clone where or not to clone the points
   * Note: If you want to not affect the path when modifying the points, set clone to true
   */
  getPoints(clone: boolean = false): Array<Vec2> {
    let result = new Array<Vec2>();
    for (let cmd of this.commands) {
      if (clone) {
        for (let p of cmd.getPoints()) {
          result.push(new Vec2().copy(p));
        }
      } else {
        result.push(...cmd.getPoints());
      }
    }
    return result;
  }
  /**Gets the points declared with lowercase path d commands
   */
  getRelativePoints(clone: boolean = false): Array<Vec2> {
    let result = new Array<Vec2>();
    for (let cmd of this.commands) {
      if (cmd.isAbsolute()) continue;
      if (clone) {
        for (let p of cmd.getPoints()) {
          result.push(new Vec2().copy(p));
        }
      } else {
        result.push(...cmd.getPoints());
      }
    }
    return result;
  }
  getAbsolutePoints(clone: boolean = false): Array<Vec2> {
    let result = new Array<Vec2>();
    for (let cmd of this.commands) {
      if (!cmd.isAbsolute()) continue;
      if (clone) {
        for (let p of cmd.getPoints()) {
          result.push(new Vec2().copy(p));
        }
      } else {
        result.push(...cmd.getPoints());
      }
    }
    return result;
  }
  /**Encodes the path to a d attribute formatted string*/
  to(): string {
    let result = "";

    let ind = 0;
    for (let cmd of this.commands) {
      result += cmd.toString();
      if (ind < this.commands.length) result += " ";
      ind++;
    }

    return result;
  }
  /**Calculates the average Vec2 of all the points that make up the path
   * effectively the center of point density
   */
  averagePoint(): Vec2 {
    return new Vec2().centerOf(...this.getPoints());
  }
  getRect(): PathRect {
    let points: Array<Vec2>;
    let result = {
      top: -Infinity,
      left: -Infinity,
      bottom: Infinity,
      right: Infinity,
      width: Infinity,
      height: Infinity
    };
    for (let c of this.commands) {
      points = c.getPoints();
      //TODO - handle non-straight lines
      for (let p of points) {
        if (p.x < result.right) result.right = p.x;
        if (p.x > result.left) result.left = p.x;
        if (p.y > result.top) result.top = p.y;
        if (p.y < result.bottom) result.top = p.y;
      }
    }
    return result;
  }
  convertCoordinates(absolute: boolean): this {
    if (!absolute) throw `Relative conversion not supported yet`;

    let currentPoint = new Vec2();
    for (let cmd of this.commands) {
      //If relative
      if (!cmd.isAbsolute()) {
        //convert the coordinates
        for (let p of cmd.getPoints()) {
          p.add(currentPoint);
        }
        //Set type to be absolute version
        cmd.setType(cmd.getType().toUpperCase());
      }

      if (cmd.isAbsolute()) {
        currentPoint.copy(cmd.getGeneratedOffset());
      } else {
        currentPoint.add(cmd.getGeneratedOffset());
      }
    }

    return this;
  }
  applyTransform(t: Transform2d): this {
    this.convertCoordinates(true);

    let ctrls = this.getPoints();

    let sinR = Math.sin(t.rotation);
    let cosR = Math.cos(t.rotation);

    //TODO - handle relative points (possibly just convert them all to absolute?)

    for (let p of ctrls) {
      p.mulScalar(t.scale);

      p.set(
        p.x * cosR - p.y * sinR,
        p.y * cosR + p.x * sinR
      );
      p.add(t.position);
    }
    return this;
  }
  /**Removes all the commands, start fresh
   */
  clear(): this {
    this.commands.length = 0;
    return this;
  }
}
