import { define, PullRequest } from '#src'

export default define({
  url: import.meta.url,
  badges: ['this-is-fine'] as const,
  present(data, grant) {
    const pulls: PullRequest[] = []

    for (const pull of data.pulls) {
      if (!pull.merged) continue
      if (pull.mergedBy?.login != data.user.login) continue

      const commit = pull.lastCommit.nodes?.[0]?.commit
      if (!commit) continue

      const checkRuns = commit.checkSuites?.nodes?.flatMap(
        (x) => x.lastCheckRun?.nodes,
      )
      if (!checkRuns || checkRuns?.length == 0) continue
      const successCount = checkRuns.filter(
        (x) => x?.conclusion == 'SUCCESS',
      ).length
      const failureCount = checkRuns.filter(
        (x) => x?.conclusion == 'FAILURE',
      ).length

      if (successCount <= failureCount) {
        pulls.push(pull)
      }
    }

    if (pulls.length > 0) {
      grant(
        'this-is-fine',
        'I merged a PR with failing checks',
      ).evidencePRsWithTitle(...pulls)
    }
  },
})
