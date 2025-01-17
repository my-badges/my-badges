import { define } from '#src'

export default define({
  url: import.meta.url,
  badges: ['conventional-commit'] as const,
  present(data, grant) {
    const counts: Record<string, number> = {}
    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const re = /^(BREAKING CHANGE|build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\(.*\))?(!)?:\s*/
        const matches = re.exec(commit.message)
        if (matches !== null) {
          counts[matches[1]] = (counts[matches[1]] || 0) + 1
        }
      }
    }
    const pairs = Object.entries(counts)
    if (pairs.length === 0) return
    pairs.sort((a, b) => b[1] - a[1])

    const names: Record<string, string> = {
      'BREAKING CHANGE': 'breaking change',
      'build': 'build',
      'chore': 'chore',
      'ci': 'continuous integration',
      'docs': 'documentation',
      'feat': 'feature',
      'fix': 'fix',
      'perf': 'performance',
      'refactor': 'refactoring',
      'revert': 'revertion',
      'style': 'esthetics',
      'test': 'test',
    }
    grant('conventional-commit', 'I use conventional commit messages').evidence(
      pairs.map(([prefix, count]) => `I've done ${count} ${names[prefix]} commit`).join('\n')
    )
  },
})

