// Adapted from https://gist.github.com/gre/1650294 - thanks gre!

export const linear = (t: number) => t;
export const easeInQuad = (t: number) => t * t;
export const easeOutQuad = (t: number) => t * (2 - t);
export const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
export const easeInCubic = (t: number) => t * t * t;
export const easeOutCubic = (t: number) => (--t) * t * t + 1;
export const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;