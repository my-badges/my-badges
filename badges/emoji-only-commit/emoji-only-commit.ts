import { define } from '#src'

export default define({
  url: import.meta.url,
  badges: ['emoji-only-commit'] as const,
  present(data, grant) {
    const commits = data.repos.flatMap((repo) =>
      repo.commits.filter((commit) =>
        /^(\p{Emoji}|\s)+$/u.test(commit.message + commit.messageBody),
      ),
    )

    if (commits.length > 0) {
      grant(
        'emoji-only-commit',
        'I used only emojis in my commit message.',
      ).evidenceCommitsWithMessage(...commits)
    }
  },
})
