const defaultColorArray = ["#38ad4f", "#9fe0ac", "#297f3a"];

type RGB = {
  r: number;
  g: number;
  b: number;
};

function hexToRGB(hex: string): RGB {
  // Remove the # character from the beginning of the hex code
  hex = hex.replace("#", "");

  // Convert the red, green, and blue components from hex to decimal
  // you can substring instead of slice as well
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Return the RGB value as an object with properties r, g, and b
  return { r, g, b };
}

/**
 * Finds the color in the given array that is closest to the target color.
 * @param {string} targetColor - The target color in hex string format (#RRGGBB).
 * @param {string[]} colorArray - An array of colors to compare against the target color.
 * @returns {string} The color in the array that is closest to the target color.
 */
export const closestColor = (
  targetColor: string,
  colorArray: string[] = defaultColorArray
) => {
  let closestDistance: number | null = null;
  let closestColor: string | null = null;

  // Convert target color from hex string to RGB values
  const targetRGB = hexToRGB(targetColor);

  // Loop through the array of colors
  colorArray.forEach((color) => {
    // Convert current color from hex string to RGB values
    const potentialColorRGB = hexToRGB(color);

    // Calculate the Euclidean distance between the target color and current color
    const distance = Math.sqrt(
      (targetRGB.r - potentialColorRGB.r) ** 2 +
        (targetRGB.g - potentialColorRGB.g) ** 2 +
        (targetRGB.b - potentialColorRGB.b) ** 2
    );

    // Update closest color and distance if the current distance is smaller than the closest distance
    if (closestDistance === null || distance < closestDistance) {
      closestDistance = distance;
      closestColor = color;
    }
  });

  return closestColor;
};

// Usage =>
//const closestColor = closestColor(targetColor, colorArray);
