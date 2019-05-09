import Star, { IStarOptions } from "./Star";
import { Size } from "./types";

export interface IStarFieldOptions {
  initialStarColor: string;
  initialSize: Size;
  starOptions: IStarGeneratorOptions[];
}

export interface IStarGeneratorOptions extends IStarOptions {
  frequency: number;
}

class Starfield {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private fieldSize: Size;
  private starColor: string;
  private stars: Star[] = [];

  constructor(canvas: HTMLCanvasElement, options: IStarFieldOptions) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const { initialStarColor, starOptions, initialSize } = options;
    this.starColor = initialStarColor;

    const { width, height } = initialSize;
    this.fieldSize = initialSize;

    this.canvas.width = width;
    this.canvas.height = height;
    
    // Generate stars
    for (let starGeneratorOption of starOptions) {
      const { frequency, ...starOptions } = starGeneratorOption;

      const numStars = width * height * frequency;

      // Add stars to array
      for (let idx = 0; idx < numStars; idx++) {
        const star = new Star(starOptions, this.getRandomCoord())
        this.stars.push(star);
      }
    }

    this.animate();
  }

  private getRandomCoord = () => {
    const { height, width } = this.fieldSize;
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);

    return { x, y };
  }

  private draw = () => {
    const { height, width } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    this.ctx.fillStyle = this.starColor;

    for (let star of this.stars) {
      const { coords: { x, y }, options: { brightness, size }} = star;

      this.ctx.globalAlpha = brightness;
      this.ctx.fillRect(x, y, size, size);

      star.advance(2);
    }
  }

  public resize = (width: number, height: number) => {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  public animate = () => {
    requestAnimationFrame(() => {
      this.draw();
      requestAnimationFrame(this.animate);
    })
  }
} 

export default Starfield;