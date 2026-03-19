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

/**
 * Truncate a string to maxLength, adding "..." if truncated
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
function truncate(str, maxLength) {
  if (!str || typeof str !== "string") return "";
  if (str.length <= maxLength) return str;
  if (maxLength < 3) return ".".repeat(maxLength);
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Convert a string to a URL-friendly slug
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")  // remove special chars
    .replace(/[\s]+/g, "-")         // spaces → hyphens
    .replace(/-+/g, "-")            // collapse multiple hyphens
    .replace(/^-|-$/g, "");         // trim leading/trailing hyphens
}

module.exports = { capitalize, sum, clamp, truncate, slugify };
