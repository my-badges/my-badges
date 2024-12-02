import { define, Reaction } from '#src'

type Where = {
  count: number
  url: string
  content?: Reaction['content']
}

export default define({
  url: import.meta.url,
  badges: ['confused', 'self-upvote'] as const,
  present(data, grant) {
    const moreThan10: Where[] = []
    const selfUpvotes: Where[] = []

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

        for (const reaction of x.reactions) {
          if (reaction.user?.login === data.user.login) {
            selfUpvotes.push({
              count: 1,
              url: x.url,
              content: reaction.content,
            })
          }
        }
      }
    }

    moreThan10.sort((a, b) => b.count - a.count)
    if (moreThan10.length > 0) {
      grant('confused', `I confused more than 10 people.`)
        .evidence(textWithCount(moreThan10))
        .tier(1)
    }

    if (selfUpvotes.length > 0) {
      grant('self-upvote', `I liked my own comment so much that I upvoted it.`)
        .evidence(textWithContent(selfUpvotes))
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

function textWithCount(entries: Where[]): string {
  const lines: string[] = []
  for (const where of entries) {
    lines.push(`* <a href="${where.url}">${where.count} 😕</a>`)
  }
  return lines.join('\n')
}

const emoji: Record<Reaction['content'], string> = {
  CONFUSED: '😕',
  EYES: '👀',
  HEART: '❤️',
  HOORAY: '🎉',
  LAUGH: '😄',
  ROCKET: '🚀',
  THUMBS_DOWN: '👎',
  THUMBS_UP: '👍',
} as const

function textWithContent(entries: Where[]): string {
  const lines: string[] = []
  for (const where of entries) {
    if (!where.content) continue
    lines.push(`* <a href="${where.url}">${emoji[where.content]}</a>`)
  }
  return lines.join('\n')
}
