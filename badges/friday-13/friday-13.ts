import { Commit, define, latest } from '#src'

export default define({
  url: import.meta.url,
  badges: ['friday-13'] as const,
  present(data, grant) {
    const commits: Commit[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const data = new Date(commit.committedDate)
        if (data.getDay() === 5 && data.getDate() === 13) {
          commits.push(commit)
        }
      }
    }

    if (commits.length > 0) {
      grant(
        'friday-13',
        'I committed on Friday the 13th, One… By One…',
      ).evidenceCommits(...commits.sort(latest).slice(0, 13))
    }
  },
})
