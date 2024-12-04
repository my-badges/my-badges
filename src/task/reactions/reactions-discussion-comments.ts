import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import { ReactionsQuery } from './reactions.graphql.js'

export default task({
  name: 'reactions-discussion-comments' as const,
  run: async ({ octokit, data }, { id }: { id: string }) => {
    const discussionReactions = paginate(octokit, ReactionsQuery, {
      id: id,
    })

    const discussionComment = data.discussionComments.find((x) => x.id === id)
    if (!discussionComment) {
      throw new Error(`Discussion comment ${id} not found`)
    }

    discussionComment.reactions = []

    for await (const resp of discussionReactions) {
      if (!resp.node?.reactions.nodes) {
        throw new Error('Failed to load discussion comment reactions')
      }

      for (const reaction of resp.node.reactions.nodes) {
        discussionComment.reactions.push(reaction)
      }

      octokit.log.info(
        `| discussion comment reactions ${discussionComment.reactions.length}/${resp.node.reactions.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
    }
  },
})
