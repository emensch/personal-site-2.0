import Starfield, { IStarFieldOptions } from "./starfield/Starfield";
import { easeOutCubic, easeInOutCubic, easeInOutQuad } from "./easingFunctions";
import { Color } from "./starfield/types";

// Setup and attach starfield 
const starfieldConfig: IStarFieldOptions = {
  initialStarColor: { r: 255, g: 255, b: 255, a: 0 },
  initialSize: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  initialSpeedMuliplier: 200,
  starOptions: [{
    frequency: 0.00006,
    size: 3,
    speed: 0.15,
    brightness: 0.4
  }, {
    frequency: 0.00008,
    size: 3,
    speed: 0.1,
    brightness: 0.3
  }, {
    frequency: 0.000225,
    size: 2,
    speed: 0.05,
    brightness: 0.3
  }]
}

const canvas = document.getElementById("starfield") as HTMLCanvasElement;
const starfield = new Starfield(canvas, starfieldConfig);

const baseStarColor: Color = { r: 255, g: 255, b: 255, a: 1 };

// On-load effect
starfield.animateSpeedMultiplier({ target: 1, duration: 3000, easingFn: easeOutCubic });
starfield.animateColor({ target: baseStarColor, duration: 2000 })

// Resize canvas setup
const resizeStarfield = () => {
  starfield.resize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resizeStarfield);
