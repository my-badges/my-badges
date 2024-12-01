export default [
  await import('./user/user.js'),
  await import('./repos/repos.js'),
  await import('./pulls/pulls.js'),
  await import('./commits/commits.js'),
  await import('./issues/issues.js'),
  await import('./issue-timeline/issue-timeline.js'),
  await import('./reactions/issue-reactions.js'),
  await import('./reactions/issue-comments-reactions.js'),
  await import('./comments/issue-comments.js'),
  await import('./comments/discussion-comments.js'),
  await import('./stars/stars.js'),
] as const
