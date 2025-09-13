import { Commit, define, latest } from '#src'

export default define({
  url: import.meta.url,
  badges: ['programmers-day'] as const,
  present(data, grant) {
    const commits: Commit[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const data = new Date(commit.committedDate)
        if (getDayOfYear(data) === 256) {
          commits.push(commit)
        }
      }
    }

    if (commits.length > 0) {
      grant(
        'programmers-day',
        'Happy Programmers Day! I committed on a 256 Day of Year!',
      ).evidenceCommits(...commits.sort(latest).slice(0, 6))
    }
  },
})

function getDayOfYear(date: Date) {
  return (
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 0)) /
    86400000
  )
}
