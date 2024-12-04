import { define, PullRequest } from '#src'

export default define({
  url: import.meta.url,
  badges: ['oss-library-night-24'] as const,
  present(data, grant) {
    const pulls: PullRequest[] = []
    const from = new Date('2024-12-01T00:00:00Z')
    const to = new Date('2024-12-31T00:00:00Z')
    const labels = [
      'oln24',
      'ossln24',
      'osslibnight24',
      'osslibrarynight24',
      'oss-lib-night-24',
      'oss lib night 24',
      'oss library night 25',
      'oss-library-night-25',
    ]
    const repos = [
      // 'google/zx',
      'webpod/zurk',
    ]
    for (const pull of data.pulls) {
      // prettier-ignore
      if (
        pull.merged &&
        pull.mergedAt &&
        new Date(pull.createdAt) >= from &&
        new Date(pull.mergedAt) <= to &&
        pull.labels?.nodes?.some(n => labels.includes(n?.name.toLowerCase())) &&
        repos.includes(pull.repository.nameWithOwner)
      ) {
        pulls.push(pull)
      }
    }

    if (pulls.length > 0) {
      grant(
        'oss-library-night-24',
        "I've participated in the [Opensource Library Night 24](#OSSLibNight24)!",
      ).evidencePRs(...pulls)
    }
  },
})
