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


// Set up button hover effects
const colorMap: { [key: string]: Color } = {
  linkedin: { r: 0, g: 119, b: 181, a: 1 },
  github: { r: 36, g: 41, b: 46, a: 1 },
  facebook: { r: 59, g: 89, b: 152, a: 1 },
  email: { r: 212, g: 70, b: 56, a: 1 }
}

const buttonMap: { [key: string]: HTMLElement } = {
  linkedin: document.getElementById("linkedin") as HTMLElement,
  github: document.getElementById("github") as HTMLElement,
  facebook: document.getElementById("facebook") as HTMLElement,
  email: document.getElementById("email") as HTMLElement
}

Object.keys(buttonMap).forEach(key => {
  const button = buttonMap[key];
  const color = colorMap[key];

  button.addEventListener("mouseenter", () => {
    starfield.animateColor({ target: color, duration: 1000 })
  });

  button.addEventListener("mouseleave", () => {
    starfield.animateColor({ target: baseStarColor, duration: 1000 })
  });
})
