import { Commit, define, latest } from '#src'

export default define({
  url: import.meta.url,
  badges: ['science-fiction-day'] as const,
  present(data, grant) {
    const commits: Commit[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const data = new Date(commit.committedDate)
        if (data.getMonth() === 0 && data.getDate() === 2) {
          commits.push(commit)
        }
      }
    }

    if (commits.length > 0) {
      grant(
        'science-fiction-day',
        "I committed on Isaac Asimov's birthday / National Science Fiction Day!",
      ).evidenceCommits(...commits.sort(latest).slice(0, 6))
    }
  },
})
