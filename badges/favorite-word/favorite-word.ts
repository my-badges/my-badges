import { define, plural } from '#src'
import { removeStopwords } from 'stopword'

export default define({
  url: import.meta.url,
  badges: ['favorite-word'] as const,
  present(data, grant) {
    const userWords = [
      data.user.login,
      ...(data.user.name ? data.user.name.split(/\s+/) : []),
    ].map((w) => w.toLowerCase())

    const counts: Record<string, number> = {}
    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const msg = commit.message + '\n' + commit.messageBody
        const words = splitWithoutTooFrequentWords(msg, userWords)
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

export function splitWithoutTooFrequentWords(msg: string, exclude: string[] = []) {
  const excludeSet = new Set(exclude.map((w) => w.toLowerCase()))
  return removeStopwords(
    msg
      .toLowerCase()
      // remove git commit trailer lines (Signed-off-by:, Co-authored-by:, etc.)
      .replace(
        /^(signed-off-by|co-authored-by|reviewed-by|acked-by|tested-by|reported-by):[ \t].+$/gm,
        '',
      )
      // remove conventional commit prefixes as they would outweigh other words
      .replace(
        /^(breaking changes?|build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(?:\(.*?\))?!?:/gm,
        '',
      )
      .split(/\s+/)
      // ignore words not including alphanumeric chars
      .filter((w) => /\w/.test(w))
      // ignore email addresses and angle-bracket tokens
      .filter((w) => !/@/.test(w) && !/^<.*>$/.test(w))
      // ignore user-provided words (e.g. the committer's own name and login)
      .filter((w) => !excludeSet.has(w)),
  )
}
