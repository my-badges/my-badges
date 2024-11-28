import { define } from '#src'
import { Reactions } from '../../src/collect/comments.graphql.js'

export default define({
  url: import.meta.url,
  badges: ['thumbs-up', 'thumbs-down', 'confused'] as const,
  present(data, grant) {
    type Reaction =
      | 'CONFUSED'
      | 'EYES'
      | 'HEART'
      | 'HOORAY'
      | 'LAUGH'
      | 'ROCKET'
      | 'THUMBS_DOWN'
      | 'THUMBS_UP'

    const reactions: {
      totalCount: number
      counts: Record<Reaction, number>
      where: string
    }[] = []

    function count(reactions: Reactions['reactions']['nodes']) {
      const counts: Record<Reaction, number> = {
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

    for (const issue of data.issues) {
      if (issue.reactions.totalCount > 0) {
        reactions.push({
          totalCount: issue.reactions.totalCount,
          counts: count(issue.reactions.nodes),
          where: issue.url,
        })
      }
    }

    for (const pull of data.pulls) {
      if (pull.reactions.totalCount > 0) {
        reactions.push({
          totalCount: pull.reactions.totalCount,
          counts: count(pull.reactions.nodes),
          where: pull.url,
        })
      }
    }

    for (const comment of data.issueComments) {
      if (comment.reactions.totalCount > 0) {
        reactions.push({
          totalCount: comment.reactions.totalCount,
          counts: count(comment.reactions.nodes),
          where: comment.url,
        })
      }
    }

    for (const discussion of data.discussionComments) {
      if (discussion.reactions.totalCount > 0 && discussion.discussion) {
        reactions.push({
          totalCount: discussion.reactions.totalCount,
          counts: count(discussion.reactions.nodes),
          where: discussion.url,
        })
      }
    }

    const up = Object.values(reactions)
    up.sort((a, b) => b.counts.THUMBS_UP - a.counts.THUMBS_UP)
    if (up.length > 0 && up[0].counts.THUMBS_UP > 10) {
      grant(
        'thumbs-up',
        `I have received a lot of thumbs up 👍 reactions!`,
      ).evidence(
        up
          .filter((p) => p.counts.THUMBS_UP > 0)
          .slice(0, 10)
          .map((p) => `- [${p.counts.THUMBS_UP} thumbs ups](${p.where})`)
          .join('\n'),
      )
    }

    const down = Object.values(reactions)
    down.sort((a, b) => b.counts.THUMBS_DOWN - a.counts.THUMBS_DOWN)
    if (down.length > 0 && down[0].counts.THUMBS_DOWN > 10) {
      grant(
        'thumbs-down',
        `I have received a lot of thumbs down 👎 reactions!`,
      ).evidence(
        down
          .filter((p) => p.counts.THUMBS_DOWN > 0)
          .slice(0, 10)
          .map((p) => `- [${p.counts.THUMBS_DOWN} thumbs downs](${p.where})`)
          .join('\n'),
      )
    }

    const confused = Object.values(reactions)
    confused.sort((a, b) => b.counts.CONFUSED - a.counts.CONFUSED)
    if (confused.length > 0 && confused[0].counts.CONFUSED > 10) {
      grant(
        'confused',
        `I have received a lot of confused 😕 reactions!`,
      ).evidence(
        confused
          .filter((p) => p.counts.CONFUSED > 0)
          .slice(0, 10)
          .map((p) => `- [${p.counts.CONFUSED} confused reactions](${p.where})`)
          .join('\n'),
      )
    }
  },
})
