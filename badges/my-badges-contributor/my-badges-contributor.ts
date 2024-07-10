import { define, PullRequest } from '#src'

export default define({
  url: import.meta.url,
  badges: ['my-badges-contributor'] as const,
  present(data, grant) {
    const pulls: PullRequest[] = []
    for (const pull of data.pulls) {
      if (
        pull.repository.name === 'my-badges' &&
        pull.repository.owner.login === 'my-badges' &&
        pull.merged
      ) {
        pulls.push(pull)
      }
    }

    if (pulls.length > 0) {
      grant(
        'my-badges-contributor',
        'I contributed to <https://github.com/my-badges/my-badges>!',
      ).evidencePRs(...pulls)
    }
  },
})
