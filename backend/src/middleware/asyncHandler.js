/**
 * Async handler to wrap async route handlers and avoid try-catch blocks
 * @param {Function} fn The async function to wrap
 * @returns {Function} The wrapped function that handles errors
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
