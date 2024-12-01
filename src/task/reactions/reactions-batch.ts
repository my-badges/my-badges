import { task } from '../../task.js'
import { paginate, query } from '../../utils.js'
import { ReactionsBatchQuery, ReactionsQuery } from './reactions.graphql.js'

export default task({
  name: 'reactions-batch' as const,
  run: async ({ octokit, data }, { ids }: { ids: string[] }) => {
    const { nodes, rateLimit } = await query(octokit, ReactionsBatchQuery, {
      ids,
    })

    console.log(
      `| reactions batch ${nodes.length} (cost: ${rateLimit?.cost}, remaining: ${rateLimit?.remaining})`,
    )
    for (const node of nodes) {
    }
    console.log(JSON.stringify(nodes, null, 2))
  },
})
