import { Commit, define, latest } from '#src'

export default define({
  url: import.meta.url,
  badges: ['alien-day'] as const,
  present(data, grant) {
    const commits: Commit[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const data = new Date(commit.committedDate)
        if (data.getMonth() === 3 && data.getDate() === 26) {
          commits.push(commit)
        }
      }
    }

    if (commits.length > 0) {
      grant(
        'alien-day',
        'I committed on the day when the crew of the **Nostromo** made their fateful landing and discovered the **Xenomorph** on **LV-426**!',
      ).evidenceCommits(...commits.sort(latest).slice(0, 6))
    }
  },
})
