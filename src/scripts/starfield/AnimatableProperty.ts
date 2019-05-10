export interface IAnimationStep {
  target: number,
  duration: number
}

class AnimatableProperty {
  private start: number;
  private currentValue: number;
  private animationSteps: IAnimationStep[] = [];
  private currentAnimationStep: IAnimationStep;
  private done: boolean = false;

  private startTime: DOMHighResTimeStamp | null = null;

  constructor (start: number, animationSteps: IAnimationStep[]) {
    this.start = start;
    this.animationSteps = [...animationSteps];

    this.currentValue = start;

    if (this.animationSteps.length === 0) {
      throw new Error("No animation steps provided!");
    }

    this.currentAnimationStep = this.animationSteps.shift() as IAnimationStep;
  }

  private getCurrentTimeStamp = () => {
    const timeStamp = performance.now();
    return timeStamp;
  }

  private ease = (t: number) => t < .5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;

  public update = () => {
    if (this.done) {
      return this.currentValue;
    }

    const currentTime = this.getCurrentTimeStamp();

    // Start animation on first update call
    if (this.startTime === null) {
      this.startTime = currentTime;
    }

    const { target, duration } = this.currentAnimationStep;

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

    this.currentValue = this.start + (target - this.start) * this.ease(percentDone);
    return this.currentValue;
  }

  public isDone = () => this.done;
}

export default AnimatableProperty;