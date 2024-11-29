import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import { PullsQuery } from './pulls.graphql.js'

export default task({
  name: 'pulls' as const,
  run: async ({ octokit, data, next }, { username }: { username: string }) => {
    const pulls = paginate(octokit, PullsQuery, {
      username,
    })

    for await (const resp of pulls) {
      if (!resp.user?.pullRequests.nodes) {
        throw new Error('Failed to load pull requests')
      }

      console.log(
        `Loading pull requests ${
          data.pulls.length + resp.user.pullRequests.nodes.length
        }/${resp.user.pullRequests.totalCount} (cost: ${
          resp.rateLimit?.cost
        }, remaining: ${resp.rateLimit?.remaining})`,
      )
      for (const pull of resp.user.pullRequests.nodes) {
        data.pulls.push(pull)
      }
    }
  },
})
