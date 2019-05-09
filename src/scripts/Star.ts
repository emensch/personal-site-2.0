import { XYCoord } from "./types";

export interface IStarOptions {
  size: number;
  speed: number;
  brightness: number;
}

class Star {
  options: IStarOptions;
  coords: XYCoord;

  constructor(options: IStarOptions, initialCoords: XYCoord) {
    this.options = options;
    this.coords = initialCoords;
  }

  public advance = (multiplier: number = 1) => {
    const { x, y } = this.coords;
    const { speed } = this.options;

    this.coords = { x, y: y + speed  * multiplier};
  }

  public setPos = (coords: XYCoord) => {
    this.coords = coords;
  }
}

export default Star;