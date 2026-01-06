import { Commit, define, latest } from '#src'

export default define({
  url: import.meta.url,
  badges: ['st-patricks-day'] as const,
  present(data, grant) {
    const commits: Commit[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const data = new Date(commit.committedDate)
        if (data.getMonth() === 2 && data.getDate() === 17) {
          commits.push(commit)
        }
      }
    }

    if (commits.length > 0) {
      grant(
        'st-patricks-day',
        "I committed on St. Patrick's Day!",
      ).evidenceCommits(...commits.sort(latest).slice(0, 6))
    }
  },
})
