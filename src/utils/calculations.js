import { POLYCHROMES_PER_PULL } from '../data/banners'

export function testLog() {
  console.log('utils working!')
}

/**
 * Placeholder calculation - swap in the real math here.
 *
 * inputs: {
 *   currentPity: number,   // pulls since last S-rank
 *   guaranteed: boolean,   // lost the last 50/50 (next S-rank is featured)
 *   pulls: number,         // pulls (tapes) on hand
 *   polychromes: number,   // polychromes on hand
 * }
 * banner: one entry from BANNERS (see src/data/banners.js)
 *
 * Keep this a pure function: no React, no localStorage, just numbers in, numbers out.
 */
export function calculatePulls(inputs, banner) {
  const pulls = Number(inputs.pulls) || 0
  const polychromes = Number(inputs.polychromes) || 0
  const currentPity = Number(inputs.currentPity) || 0

  const totalPulls = pulls + Math.floor(polychromes / POLYCHROMES_PER_PULL)
  const pullsToHardPity = Math.max(banner.hardPity - currentPity, 0)
  // Worst case for the featured S-rank: lost the 50/50 -> two full pity bars.
  const worstCaseFeatured = inputs.guaranteed
    ? pullsToHardPity
    : pullsToHardPity + banner.hardPity

  return {
    totalPulls,
    pullsToHardPity,
    worstCaseFeatured,
    // TODO: real math goes here
    successChance: null,
    expectedPulls: null,
    isPlaceholder: true,
  }
}
