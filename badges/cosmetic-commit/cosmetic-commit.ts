import { Commit, define, latest } from '#src'

export default define({
  url: import.meta.url,
  badges: ['cosmetic-commit'] as const,
  present(data, grant) {
    const commits: Commit[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        if (
          /cosmetic/i.test(commit.message) ||
          /^(style|lint)\b/.test(commit.message)
        ) {
          commits.push(commit)
        }
      }
    }

    if (commits.length > 0) {
      grant('cosmetic-commit', 'I made cosmetic commit.').evidenceCommits(
        ...commits.sort(latest).slice(0, 6),
      )
    }
  },
})
