import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import { ReactionsQuery } from './reactions.graphql.js'

export default task({
  name: 'reactions-pull' as const,
  run: async ({ octokit, data }, { id }: { id: string }) => {
    const pullReactions = paginate(octokit, ReactionsQuery, {
      id,
    })

    const pull = data.pulls.find((x) => x.id === id)
    if (!pull) {
      throw new Error(`Pull ${id} not found`)
    }

    pull.reactions = []

    for await (const resp of pullReactions) {
      if (!resp.node?.reactions.nodes) {
        throw new Error('Failed to load pull reactions')
      }

      for (const reaction of resp.node.reactions.nodes) {
        pull.reactions.push(reaction)
      }

      console.log(
        `| pull reactions ${data.issueComments.length}/${resp.node.reactions.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
    }
  },
})
