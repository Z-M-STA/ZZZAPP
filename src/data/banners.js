// Banner rules for the pull calculator.
// NOTE: values are starting points - double-check them against the current patch.
// When a patch changes anything, this is the only file you should need to edit.

export const POLYCHROMES_PER_PULL = 160

export const BANNERS = {
  agent: {
    id: 'agent',
    name: 'Exclusive Channel (Agent)',
    baseRate: 0.006, // S-rank rate before soft pity
    softPityStart: 74, // pull number where the rate starts climbing
    hardPity: 90, // guaranteed S-rank
    featuredChance: 0.5, // chance the S-rank is the featured one (50/50)
  },
  engine: {
    id: 'engine',
    name: 'W-Engine Channel',
    baseRate: 0.01,
    softPityStart: 65,
    hardPity: 80,
    featuredChance: 0.75, // 75/25
  },
}

export const DEFAULT_BANNER_ID = 'agent'
