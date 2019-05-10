import Star, { IStarOptions } from "./Star";
import { Size, XYCoord, Color } from "./types";
import AnimatableProperty, { IAnimationStep } from "./AnimatableProperty";

export interface IStarFieldOptions {
  initialStarColor: Color;
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
  private starColor: Color;
  private starOptions: IStarGeneratorOptions[] = [];
  private stars: Star[] = [];

  private currentSpeedMultiplier = 1;

  private speedAnimator: AnimatableProperty<number> | null = null;
  private colorAnimator: AnimatableProperty<Color> | null = null;

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

  public animateSpeed = (animationSteps: IAnimationStep<number> | IAnimationStep<number>[]) => {
    const steps = Array.isArray(animationSteps) ? animationSteps : [animationSteps];
    this.speedAnimator = new AnimatableProperty(
      this.currentSpeedMultiplier, 
      steps, 
      (start, end, percentDone) => start + (end - start) * percentDone
    );
  }

  public animateColor = (animationSteps: IAnimationStep<Color> | IAnimationStep<Color>[]) => {
    const steps = Array.isArray(animationSteps) ? animationSteps : [animationSteps];
    this.colorAnimator = new AnimatableProperty(
      this.starColor,
      steps,
      (start, end, percentDone) => {
        return {
          r: start.r + (end.r - start.r) * percentDone,
          g: start.g + (end.g - start.g) * percentDone,
          b: start.b + (end.b - start.b) * percentDone,
          a: start.a + (end.a - start.a) * percentDone
        }
      }
    )
  }

  public animate = () => {
    requestAnimationFrame(() => {
      this.draw();
      this.handleSpeedAnimator();
      this.handleColorAnimator();
      requestAnimationFrame(this.animate);
    })
  }

  private handleSpeedAnimator = () => {
    if (this.speedAnimator) {
      this.currentSpeedMultiplier = this.speedAnimator.update();

      if (this.speedAnimator.isDone()) {
        this.speedAnimator = null;
      }
    }
  }

  private handleColorAnimator = () => {
    if (this.colorAnimator) {
      this.starColor = this.colorAnimator.update();

      if (this.colorAnimator.isDone()) {
        this.colorAnimator = null;
      }
    }
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

    this.ctx.fillStyle = this.getColorString(this.starColor);

    for (let star of this.stars) {
      const { coords: { x, y }, options: { brightness, size }} = star;

      const stretchDir = Math.sign(this.currentSpeedMultiplier);
      const absMultiplier = Math.abs(this.currentSpeedMultiplier);
      const stretch = Math.floor(Math.sqrt(size * absMultiplier));

      this.ctx.globalAlpha = brightness;
      this.ctx.fillRect(x, y - (stretch / 2) * stretchDir, size, size + stretch);

      if (y > fieldHeight) {
        const newX = Math.floor(Math.random() * width);
        star.setPos({ x: newX, y: 0 - size })
      }

      star.advance(this.currentSpeedMultiplier);
    }
  }

  private getColorString = (color: Color) => {
    const { r, g, b, a } = color;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
} 

export default Starfield;