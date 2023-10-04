export const allBadges = [
  await import('./dead-commit/dead-commit.js'),
  await import('./fuck-commit/fuck-commit.js'),
  await import('./mass-delete-commit/mass-delete-commit.js'),
  await import('./revert-revert-commit/revert-revert-commit.js'),
  await import('./abc-commit/abc-commit.js')
] as const
