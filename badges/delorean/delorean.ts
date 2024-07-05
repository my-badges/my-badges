import { Commit, define } from '#src'

export default define({
  url: import.meta.url,
  badges: ['delorean'] as const,
  present(data, grant) {
    const commits: Commit[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const data = new Date(commit.committedDate)
        if (data.getMonth() === 10 && data.getDate() === 5) {
          commits.push(commit)
        }
      }
    }

    if (commits.length > 0) {
      grant(
        'delorean',
        'I committed on the day Doctor Emmett Brown invented the flux capacitor!',
      ).evidenceCommits(...commits.sort(latest).slice(0, 6))
    }
  },
})

function latest(a: Commit, b: Commit) {
  return (
    new Date(b.committedDate).getTime() - new Date(a.committedDate).getTime()
  )
}
