import Starfield, { IStarFieldOptions } from "./starfield/Starfield";

// Attach starfield 
const starfieldConfig: IStarFieldOptions = {
  initialStarColor: "#FFFFFF",
  initialSize: {
    width: window.innerWidth,
    height: window.innerHeight
  },
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


// Resize canvas 
const resizeStarfield = () => {
  starfield.resize(window.innerWidth, window.innerHeight);
}

setTimeout(() => starfield.animateSpeed([{ target: 100, duration: 2000 }, { target: 1, duration: 2000 }]), 1000);

window.addEventListener("resize", resizeStarfield);