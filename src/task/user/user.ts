import { task } from '../../task.js'
import { UserQuery } from './user.graphql.js'
import { query } from '../../utils.js'

export default task({
  name: 'user' as const,
  run: async ({ octokit, data, next }, { username }: { username: string }) => {
    const { user } = await query(octokit, UserQuery, {
      login: username,
    })!

    if (!user) {
      throw new Error('Failed to load user')
    }

    data.user = user
  },
})
