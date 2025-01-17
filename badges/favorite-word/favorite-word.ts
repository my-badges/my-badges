import { define, plural } from '#src'
import { removeStopwords } from 'stopword'

export default define({
  url: import.meta.url,
  badges: ['favorite-word'] as const,
  present(data, grant) {
    const counts: Record<string, number> = {}
    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const msg = commit.message + '\n' + commit.messageBody
        const words = removeStopwords(
          msg
            .toLowerCase()
            // remove conventional commit prefixes as they would outweigh other words
            .replace(/^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\(.+\))?:\s+/, '')
            .split(/\s+/)
            // ignore words not including alphanumeric chars
            .filter((w) => /\w/.test(w)),
        )
        for (const word of words) {
          counts[word] = (counts[word] || 0) + 1
        }
      }
    }
    const pairs = Object.entries(counts)
    pairs.sort((a, b) => b[1] - a[1])
    if (pairs.length === 0) return
    const topWords = pairs.slice(0, 5)
    grant('favorite-word', `My favorite word is "${topWords[0][0]}".`).evidence(
      `My favorite commit message words are:\n\n` +
        topWords
          .map(
            (p, i) =>
              `${i + 1}. ${p[0]} (used ${plural(p[1], 'once', '%d times')})`,
          )
          .join('\n'),
    )
  },
})
