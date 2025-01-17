import { define } from '#src'

export default define({
  url: import.meta.url,
  badges: ['conventional-commit'] as const,
  present(data, grant) {
	let usesConventionalCommits = false
    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const re = /^(BREAKING CHANGE|build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\(.*\))?(!)?:\s*/
        if (re.test(commit.message)) {
		  usesConventionalCommits = true
        }
      }
    }
    if (!usesConventionalCommits) return
    grant('conventional-commit', 'I use conventional commit messages').evidence('')
  },
})

