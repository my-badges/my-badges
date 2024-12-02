import { define, Reaction } from '#src'

type Where = {
  count: number
  url: string
}

export default define({
  url: import.meta.url,
  badges: ['confused'] as const,
  present(data, grant) {
    const moreThan10: Where[] = []

    for (const x of [
      ...data.issues,
      ...data.pulls,
      ...data.discussionComments,
      ...data.issueComments,
    ]) {
      if (x.reactions && x.reactions.length > 0) {
        const counts = count(x.reactions)
        if (counts.CONFUSED > 10) {
          moreThan10.push({ count: counts.CONFUSED, url: x.url })
        }
      }
    }

    moreThan10.sort((a, b) => b.count - a.count)

    if (moreThan10.length > 0) {
      grant('confused', `I confused more than 10 people.`)
        .evidence(text(moreThan10))
        .tier(1)
    }
  },
})

function count(reactions: Reaction[] | undefined) {
  const counts: Record<Reaction['content'], number> = {
    CONFUSED: 0,
    EYES: 0,
    HEART: 0,
    HOORAY: 0,
    LAUGH: 0,
    ROCKET: 0,
    THUMBS_DOWN: 0,
    THUMBS_UP: 0,
  }
  for (const reaction of reactions ?? []) {
    counts[reaction.content] = (counts[reaction.content] || 0) + 1
  }
  return counts
}

function text(entries: Where[]): string {
  const lines: string[] = []
  for (const where of entries) {
    lines.push(`* <a href="${where.url}">${where.count} 😕</a>`)
  }
  return lines.join('\n')
}
