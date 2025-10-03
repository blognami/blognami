
export function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (typeof value == "object" && value !== null) {
      // Handle arrays specially - replace them entirely instead of merging
      if (Array.isArray(value)) {
        target[key] = [...value]; // Create a shallow copy of the array
      } else {
        // Handle regular objects
        if (typeof target[key] != "object" || target[key] === null || Array.isArray(target[key])) {
          target[key] = {};
        } else {
          target[key] = { ...target[key] };
        }
        deepMerge(target[key], value);
      }
    } else {
      target[key] = value;
    }
  }
}
