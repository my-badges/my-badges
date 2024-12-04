import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import { PullsQuery } from './pulls.graphql.js'

export default task({
  name: 'pulls' as const,
  run: async ({ octokit, data, batch }, { username }: { username: string }) => {
    const pulls = paginate(octokit, PullsQuery, {
      username,
    })

    data.pulls = []

    const batchReactions = batch('reactions-pull', 'reactions-batch')

    for await (const resp of pulls) {
      if (!resp.user?.pullRequests.nodes) {
        throw new Error('Failed to load pull requests')
      }

      octokit.log.info(
        `| pull requests ${
          data.pulls.length + resp.user.pullRequests.nodes.length
        }/${resp.user.pullRequests.totalCount} (cost: ${
          resp.rateLimit?.cost
        }, remaining: ${resp.rateLimit?.remaining})`,
      )
      for (const pull of resp.user.pullRequests.nodes) {
        data.pulls.push(pull)
        batchReactions(pull.reactionsTotal.totalCount, pull.id)
      }
    }
  },
})
