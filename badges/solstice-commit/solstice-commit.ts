import { Commit, define, latest } from '#src'

export default define({
  url: import.meta.url,
  badges: ['summer-solstice-commits', 'winter-solstice-commits'] as const,
  present(data, grant) {
    const summerSolsticeCommits: Commit[] = []
    const winterSolsticeCommits: Commit[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const date = new Date(commit.committedDate)
        // June 21st, approx. 15:00 UTC
        if (
          date.getMonth() === 5 &&
          date.getDate() === 21 &&
          date.getUTCHours() >= 14 &&
          date.getUTCHours() < 16
        ) {
          summerSolsticeCommits.push(commit)
        }
        // December 21st, approx. 22:00 UTC
        if (
          date.getMonth() === 11 &&
          date.getDate() === 21 &&
          date.getUTCHours() >= 21 &&
          date.getUTCHours() < 23
        ) {
          winterSolsticeCommits.push(commit)
        }
      }
    }

    if (summerSolsticeCommits.length > 0) {
      grant(
        'summer-solstice-commits',
        'I commit in the Summer solstice.',
      ).evidenceCommits(...summerSolsticeCommits.sort(latest).slice(0, 6))
    }
    if (winterSolsticeCommits.length > 0) {
      grant(
        'winter-solstice-commits',
        'I commit in the Winter solstice.',
      ).evidenceCommits(...winterSolsticeCommits.sort(latest).slice(0, 6))
    }
  },
})
