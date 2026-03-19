/**
 * Utility functions for Loop Kit Playground
 */

/**
 * Capitalize the first letter of a string
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Calculate the sum of an array of numbers
 * @param {number[]} numbers
 * @returns {number}
 */
function sum(numbers) {
  if (!Array.isArray(numbers)) return 0;
  return numbers.reduce((a, b) => a + b, 0);
}

/**
 * Clamp a number between min and max
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

module.exports = { capitalize, sum, clamp };
