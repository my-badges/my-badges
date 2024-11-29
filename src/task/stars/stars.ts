import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import { StarsQuery } from './stars.graphql.js'

export default task({
  name: 'stars' as const,
  run: async ({ octokit, data, next }, { username }: { username: string }) => {
    const stars = paginate(octokit, StarsQuery, {
      login: username,
    })
    for await (const resp of stars) {
      if (!resp.user?.starredRepositories.nodes) {
        throw new Error('Failed to load stars')
      }

      for (const repo of resp.user.starredRepositories.nodes) {
        data.starredRepositories.push(repo)
      }
      console.log(
        `| stars ${data.starredRepositories.length}/${resp.user.starredRepositories.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
    }
  },
})
