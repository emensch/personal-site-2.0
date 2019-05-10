export interface IAnimationStep<T> {
  target: T,
  duration: number,
  easingFn?: (t: number) => number
}

export type LerpFn<T> = (start: T, end: T, percentDone: number) => T;

class AnimatableProperty<T> {
  private start: T;
  private currentValue: T;
  private animationSteps: IAnimationStep<T>[] = [];
  private currentAnimationStep: IAnimationStep<T>;
  private lerpFn: LerpFn<T>; 

  private done: boolean = false;

  private startTime: DOMHighResTimeStamp | null = null;

  constructor (start: T, animationSteps: IAnimationStep<T>[], lerpFn: LerpFn<T>) {
    this.start = start;
    this.animationSteps = [...animationSteps];

    this.lerpFn = lerpFn;

    this.currentValue = start;

    if (this.animationSteps.length === 0) {
      throw new Error("No animation steps provided!");
    }

    this.currentAnimationStep = this.animationSteps.shift() as IAnimationStep<T>;
  }

  private getCurrentTimeStamp = () => {
    const timeStamp = performance.now();
    return timeStamp;
  }

  private defaultEase = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  public update = () => {
    if (this.done) {
      return this.currentValue;
    }

    const currentTime = this.getCurrentTimeStamp();

    // Start animation on first update call
    if (this.startTime === null) {
      this.startTime = currentTime;
    }

    const { target, duration, easingFn } = this.currentAnimationStep;

    const timeDiff = currentTime - this.startTime;

    if (timeDiff > duration) {
      // Move to next animation
      this.start = this.currentValue;
      this.startTime = currentTime;

      const potentialStep = this.animationSteps.shift();

      // If we're out of steps, set done
      if (potentialStep === undefined) {
        this.done = true;
        return this.currentValue;
      }

      this.currentAnimationStep = potentialStep;
      return this.currentValue;      
    }

    const percentDone = timeDiff / duration;

    const selectedEasingFn = easingFn || this.defaultEase;

    this.currentValue = this.lerpFn(this.start, target, selectedEasingFn(percentDone))
    return this.currentValue;
  }

  public isDone = () => this.done;
}

export default AnimatableProperty;