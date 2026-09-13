'use strict';

/**
 * Determines if an event should trigger the missed call rescue flow
 * @param {Object} event - The normalized event object
 * @returns {boolean} True if rescue should start, false otherwise
 */
function shouldStartRescue(event) {
  // Only start rescue for CALL_MISSED events (no-answer calls)
  // Do not start for other call statuses like 'completed', 'busy', etc.
  if (event.type === 'CALL_MISSED') {
    return true;
  }

  return false;
}

module.exports = {
  shouldStartRescue,
};