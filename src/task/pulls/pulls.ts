import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import { PullsQuery } from './pulls.graphql.js'

export default task({
  name: 'pulls' as const,
  run: async ({ octokit, data, next }, { username }: { username: string }) => {
    const pulls = paginate(octokit, PullsQuery, {
      username,
    })

    data.pulls = []

    let reactionsBatch: string[] = []

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
        if (pull.reactionsTotal.totalCount > 0) {
          if (reactionsBatch.length > 100) {
            next('reactions-pull', {
              id: pull.id,
            })
          } else {
            reactionsBatch.push(pull.id)
            if (reactionsBatch.length === 50) {
              next('reactions-batch', {
                ids: reactionsBatch,
              })
              reactionsBatch = []
            }
          }
        }
      }
    }

    if (reactionsBatch.length > 0) {
      next('reactions-batch', {
        ids: reactionsBatch,
      })
    }
  },
})
