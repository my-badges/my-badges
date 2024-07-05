import { Commit, define } from '#src'

export default define({
  url: import.meta.url,
  tiers: true,
  badges: [
    'fix-2',
    'fix-3',
    'fix-4',
    'fix-5',
    'fix-6',
    'fix-6+', // For more than 6
  ] as const,
  present(data, grant) {
    for (const repo of data.repos) {
      const sequences: Commit[][] = []
      let previousCommitDate = null
      let evidence: Commit[] = []

      for (const commit of repo.commits) {
        const currentCommitDate = new Date(commit.committedDate)

        const isFix = /^fix/i.test(commit.message)
        const isSequential =
          previousCommitDate === null ||
          currentCommitDate.getTime() - previousCommitDate.getTime() <=
            15 * 60 * 1000

        if (isFix && isSequential) {
          evidence.push(commit)
        } else {
          sequences.push(evidence)
          evidence = isFix ? [commit] : []
        }

        previousCommitDate = currentCommitDate
      }

      if (evidence.length > 0) {
        sequences.push(evidence)
      }

      sequences.sort((a, b) => a.length - b.length)

      for (const sec of sequences) {
        const count = sec.length
        const description = `I did ${count} sequential fixes.`

        if (count === 2)
          grant('fix-2', description)
            .evidenceCommitsWithMessage(...sec)
            .tier(1)
        else if (count === 3)
          grant('fix-3', description)
            .evidenceCommitsWithMessage(...sec)
            .tier(2)
        else if (count === 4)
          grant('fix-4', description)
            .evidenceCommitsWithMessage(...sec)
            .tier(3)
        else if (count === 5)
          grant('fix-5', description)
            .evidenceCommitsWithMessage(...sec)
            .tier(4)
        else if (count === 6)
          grant('fix-6', description)
            .evidenceCommitsWithMessage(...sec)
            .tier(5)
        else if (count > 6)
          grant('fix-6+', description)
            .evidenceCommitsWithMessage(...sec)
            .tier(6)
      }
    }
  },
})
