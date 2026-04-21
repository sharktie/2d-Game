// StarTracker handles reading and writing per-level star data to localStorage.
// Stars are stored as a bitmask: bit 0 = completion, bit 1 = all-coins, bit 2 = time.
// A higher bitmask (more stars) always wins — you can't lose stars on a retry.

const STORAGE_KEY = 'platformer_stars';

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveAll(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Silently ignore storage failures (private browsing etc.)
  }
}

/**
 * Get the star bitmask for a level (0–7).
 * Bit 0 (value 1) = completed
 * Bit 1 (value 2) = all coins collected
 * Bit 2 (value 4) = time star earned
 */
export function getStars(levelId) {
  return loadAll()[levelId] ?? 0;
}

/**
 * Calculate which stars were earned in this run and persist the best result.
 * @param {number} levelId
 * @param {boolean} completed       — reached the flag
 * @param {boolean} allCoins        — collected every coin
 * @param {number}  elapsedSeconds  — total seconds from level start to flag
 * @param {number}  timeStarSeconds — threshold for the time star
 * @returns {{ earned: number, total: number, newBest: boolean }}
 */
export function awardStars(levelId, completed, allCoins, elapsedSeconds, timeStarSeconds) {
  let earned = 0;
  if (completed)                         earned |= 1;
  if (completed && allCoins)             earned |= 2;
  if (completed && elapsedSeconds <= timeStarSeconds) earned |= 4;

  const all      = loadAll();
  const previous = all[levelId] ?? 0;
  const best     = earned | previous;   // keep the highest combination
  const newBest  = best !== previous;

  all[levelId] = best;
  saveAll(all);

  return {
    earned,          // what was earned this run (0-7)
    total: best,     // best ever for this level
    newBest          // did this run improve the record?
  };
}

/** Returns how many stars (0–3) are in a bitmask. */
export function countStars(bitmask) {
  return (bitmask & 1 ? 1 : 0) +
         (bitmask & 2 ? 1 : 0) +
         (bitmask & 4 ? 1 : 0);
}

/** Clear all star data (useful for a "reset progress" option). */
export function clearAllStars() {
  saveAll({});
}
