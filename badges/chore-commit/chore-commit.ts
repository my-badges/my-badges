import { define } from '#src'

export default define({
  url: import.meta.url,
  badges: ['chore-commit'] as const,
  present(data, grant) {
    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        if (/^chore\b/.test(commit.message)) {
          grant(
            'chore-commit',
            'I did a little housekeeping! 🧹',
          ).evidenceCommitsWithMessage(commit)
          return
        }
      }
    }
  },
})
