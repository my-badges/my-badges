import { define, PullRequest } from '#src'

export default define({
  url: import.meta.url,
  tiers: true,
  badges: [
    'pr-collaboration-5',
    'pr-collaboration-10',
    'pr-collaboration-15',
    'pr-collaboration-20',
    'pr-collaboration-25',
  ] as const,
  present(data, grant) {
    for (const pull of data.pulls.sort(byParticipantsCount)) {
      if (pull.participants.totalCount >= 5) {
        grant(
          'pr-collaboration-5',
          'I have participated in pull requests with 5 or more people',
        )
          .evidencePRsWithTitle(pull)
          .tier(1)
      }
      if (pull.participants.totalCount >= 10) {
        grant(
          'pr-collaboration-10',
          'I have participated in pull requests with 10 or more people',
        )
          .evidencePRsWithTitle(pull)
          .tier(2)
      }
      if (pull.participants.totalCount >= 15) {
        grant(
          'pr-collaboration-15',
          'I have participated in pull requests with 15 or more people',
        )
          .evidencePRsWithTitle(pull)
          .tier(3)
      }
      if (pull.participants.totalCount >= 20) {
        grant(
          'pr-collaboration-20',
          'I have participated in pull requests with 20 or more people',
        )
          .evidencePRsWithTitle(pull)
          .tier(4)
      }
      if (pull.participants.totalCount >= 25) {
        grant(
          'pr-collaboration-25',
          'I have participated in pull requests with 25 or more people',
        )
          .evidencePRsWithTitle(pull)
          .tier(5)
      }
    }
  },
})

function byParticipantsCount(a: PullRequest, b: PullRequest) {
  return a.participants.totalCount - b.participants.totalCount
}
