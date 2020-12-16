
export const SVGPathDCommands = "MLQTCSAZVH";
export const SVGPathDCommandRegEx = /([MLQTCSAZVH])([^MLQTCSAZVH]*)/gi

export function pathGetPoints (path: SVGPathElement): Array<number> {
  let d = path.getAttribute("d");

  let points: Array<number> = new Array();
  let commands = d.match(SVGPathDCommandRegEx);

  let pieces: Array<string>;
  let nums: Array<string>;
  for (let cmd of commands) {
    pieces = cmd.split(" ");

    for (let piece of pieces) {
      if (!piece || SVGPathDCommands.includes(piece.toUpperCase())) continue;
      nums = piece.split(",");
      if (nums.length % 2 == 0) {
        for (let num of nums) {
          points.push(parseFloat(num));
        }
      }
    }
  }
  return points;
}

export function averagePoint2d (points: Array<number>): Array<number> {
  // if (points.length %2 !== 0) throw `points.length ${points.length} not a multiple of 2`;

  let x: number = 0;
  let y: number = 0;

  for (let i=0; i<points.length; i+=2) {
    x += points[i];
    y += points[i+1];
  }
  x /= points.length/2;
  y /= points.length/2;

  return [x, y];
}

export function pathGetCenterOfDensity (path: SVGPathElement): Array<number> {
  return averagePoint2d(pathGetPoints(path));
}

export function gGetCenterOfDensity (g: SVGGElement): Array<number> {
  let tmp: Array<number>;
  let x: number = 0;
  let y: number = 0;
  let count: number = 0;

  for (let child of g.children) {
    //TODO - handle other shapes
    if (child instanceof SVGPathElement) {
      count ++;
      tmp = pathGetCenterOfDensity(child);
      x += tmp[0];
      y += tmp[1];
    }
  }
  x /= count;
  y /= count;

  return [x, y];
}
