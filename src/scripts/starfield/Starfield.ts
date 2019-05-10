import Star, { IStarOptions } from "./Star";
import { Size, XYCoord } from "./types";
import AnimatableProperty, { IAnimationStep } from "./AnimatableProperty";

export interface IStarFieldOptions {
  initialStarColor: string;
  initialSize: Size;
  starOptions: IStarGeneratorOptions[];
}

export interface IStarGeneratorOptions extends IStarOptions {
  frequency: number;
}

class Starfield {
  private RESIZE_FACTOR = 1.25;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private fieldSize: Size;
  private starColor: string;
  private starOptions: IStarGeneratorOptions[] = [];
  private stars: Star[] = [];

  private currentSpeedMultiplier = 1;
  private speedAnimator: AnimatableProperty | null = null;

  constructor(canvas: HTMLCanvasElement, options: IStarFieldOptions) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const { initialStarColor, starOptions, initialSize } = options;
    this.starColor = initialStarColor;
    this.starOptions = starOptions;

    const { width, height } = initialSize;
    const fieldWidth = width * this.RESIZE_FACTOR;
    const fieldHeight = height * this.RESIZE_FACTOR;
    this.fieldSize = { width: fieldWidth, height: fieldHeight };

    this.canvas.width = width;
    this.canvas.height = height;

    this.createStarsInArea({ x: 0, y: 0 }, { x: fieldWidth, y: fieldHeight });
  
    this.animate();
  }

  private createStarsInArea = (start: XYCoord, end: XYCoord) => {
    const width = end.x - start.x;
    const height = end.y - start.y;

    for (let starGeneratorOption of this.starOptions) {
      const { frequency, ...starOptions } = starGeneratorOption;

      const numStars = Math.floor(width * height * frequency);

      for (let idx = 0; idx < numStars; idx++) {
        const star = new Star(starOptions, this.getRandomCoord(start, end))
        this.stars.push(star);
      }
    }
  }

  private getRandomCoord = (start: XYCoord, end: XYCoord) => {
    const width = end.x - start.x;
    const height = end.y - start.y;

    const x = Math.floor(Math.random() * width) + start.x;
    const y = Math.floor(Math.random() * height) + start.y;

    return { x, y };
  }

  private draw = () => {
    const { height, width } = this.canvas;
    const { height: fieldHeight } = this.fieldSize;
    this.ctx.clearRect(0, 0, width, height);

    this.ctx.fillStyle = this.starColor;

    for (let star of this.stars) {
      const { coords: { x, y }, options: { brightness, size }} = star;

      this.ctx.globalAlpha = brightness;
      this.ctx.fillRect(x, y, size, size);

      if (y > fieldHeight) {
        const newX = Math.floor(Math.random() * width);
        star.setPos({ x: newX, y: 0 - size })
      }

      star.advance(this.currentSpeedMultiplier);
    }
  }

  private handleSpeedAnimator = () => {
    if (this.speedAnimator) {
      this.currentSpeedMultiplier = this.speedAnimator.update();

      if (this.speedAnimator.isDone()) {
        this.speedAnimator = null;
      }
    }
  }

  public resize = (width: number, height: number) => {
    this.canvas.width = width;
    this.canvas.height = height;

    const { width: fieldWidth, height: fieldHeight } = this.fieldSize;

    const widthResizeNeeded = width > fieldWidth;
    const heightResizeNeeded = height > fieldHeight;

    if (widthResizeNeeded || heightResizeNeeded) {
      const newWidth = Math.max(fieldWidth * this.RESIZE_FACTOR, width * this.RESIZE_FACTOR);
      const newHeight = Math.max(fieldHeight * this.RESIZE_FACTOR, width * this.RESIZE_FACTOR);
  
      if (widthResizeNeeded) {
        this.fieldSize.width = newWidth;
        this.createStarsInArea({ x: fieldWidth, y: 0 }, { x: newWidth, y: fieldHeight });
      }
  
      if (heightResizeNeeded) {
        this.fieldSize.height = newHeight;
        this.createStarsInArea({ x: 0, y: fieldHeight }, { x: fieldWidth, y: newHeight });
      }
  
      if (heightResizeNeeded && widthResizeNeeded) {
        this.createStarsInArea({ x: fieldWidth, y: fieldHeight }, { x: newWidth, y: newHeight });
      }
    }
  }

  public setStarColor = (color: string) => {
    this.starColor = color;
  }

  public animateSpeed = (animationSteps: IAnimationStep | IAnimationStep[]) => {
    const steps = Array.isArray(animationSteps) ? animationSteps : [animationSteps];
    this.speedAnimator = new AnimatableProperty(this.currentSpeedMultiplier, steps);
  }

  public animate = () => {
    requestAnimationFrame(() => {
      this.draw();
      this.handleSpeedAnimator();
      requestAnimationFrame(this.animate);
    })
  }
} 

export default Starfield;