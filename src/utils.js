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
 * Convert a string to a URL-friendly slug
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')  // remove special chars
    .replace(/[\s]+/g, '-')         // spaces → hyphens
    .replace(/-+/g, '-')            // collapse multiple hyphens
    .replace(/^-|-$/g, '');         // trim leading/trailing hyphens
}

module.exports = { capitalize, sum, clamp, slugify };
