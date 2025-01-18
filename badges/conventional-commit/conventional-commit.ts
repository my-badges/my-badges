import { define } from '#src'
import { Data } from '../../src/data.js'

export default define({
  url: import.meta.url,
  badges: ['conventional-commit'] as const,
  present(data: Data, grant) {
    const dataList = data.repos.flatMap(repo => repo.commits.map(commit => commit.message))
    const pairs = countBadgeType(dataList)
    if (pairs.length === 0) return
    pairs.sort((a, b) => b[1] - a[1])
    pairs.splice(6)

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

export function countBadgeType(data: string[]): [string, number][] {
  const counts: Record<string, number> = {}
  for (const commit of data) {
    const re = /^(BREAKING CHANGE|build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\(.*\))?(!)?:\s*/
    const matches = re.exec(commit)
    if (matches !== null) {
      counts[matches[1]] = (counts[matches[1]] || 0) + 1
      if (matches[3] === '!' && matches[1] !== 'BREAKING CHANGE') {
        counts['BREAKING CHANGE'] = (counts['BREAKING CHANGE'] || 0) + 1
      }
    }
  }
  return Object.entries(counts)
}
