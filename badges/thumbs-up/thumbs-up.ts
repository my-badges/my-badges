import { define, Reaction } from '#src'

type Where = {
  count: number
  url: string
}

export default define({
  url: import.meta.url,
  tiers: true,
  badges: ['thumbs-up-10', 'thumbs-up-50', 'thumbs-up-100'] as const,
  present(data, grant) {
    const moreThan10: Where[] = []
    const moreThan50: Where[] = []
    const moreThan100: Where[] = []

    for (const x of [
      ...data.issues,
      ...data.pulls,
      ...data.discussionComments,
      ...data.issueComments,
    ]) {
      if (x.reactions && x.reactions.length > 0) {
        const counts = count(x.reactions)
        if (counts.THUMBS_UP > 100) {
          moreThan100.push({ count: counts.THUMBS_UP, url: x.url })
        } else if (counts.THUMBS_UP > 50) {
          moreThan50.push({ count: counts.THUMBS_UP, url: x.url })
        } else if (counts.THUMBS_UP > 10) {
          moreThan10.push({ count: counts.THUMBS_UP, url: x.url })
        }
      }
    }

    moreThan10.sort((a, b) => b.count - a.count)
    moreThan50.sort((a, b) => b.count - a.count)
    moreThan100.sort((a, b) => b.count - a.count)

    if (moreThan10.length > 0) {
      grant('thumbs-up-10', `I got more than 10 thumbs up.`)
        .evidence(text(moreThan10))
        .tier(1)
    }
    if (moreThan50.length > 0) {
      grant('thumbs-up-50', `I got more than 50 thumbs up.`)
        .evidence(text(moreThan50))
        .tier(2)
    }
    if (moreThan100.length > 0) {
      grant('thumbs-up-100', `I got more than 100 thumbs up.`)
        .evidence(text(moreThan100))
        .tier(3)
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
    lines.push(`* <a href="${where.url}">${where.count} 👍</a>`)
  }
  return lines.join('\n')
}
