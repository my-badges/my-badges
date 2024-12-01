import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import { IssuesQuery } from './issues.graphql.js'

export default task({
  name: 'issues' as const,
  run: async ({ octokit, data, next }, { username }: { username: string }) => {
    const issues = paginate(octokit, IssuesQuery, {
      username,
    })

    data.issues = []
    for await (const resp of issues) {
      if (!resp.user?.issues.nodes) {
        throw new Error('Failed to load issues')
      }

      console.log(
        `Loading issues ${data.issues.length + resp.user.issues.nodes.length}/${
          resp.user.issues.totalCount
        } (cost: ${resp.rateLimit?.cost}, remaining: ${
          resp.rateLimit?.remaining
        })`,
      )
      for (const issue of resp.user.issues.nodes) {
        data.issues.push(issue)
        next('issue-timeline', {
          owner: issue.repository.owner.login,
          name: issue.repository.name,
          number: issue.number,
        })
        next('issue-reactions', {
          owner: issue.repository.owner.login,
          name: issue.repository.name,
          number: issue.number,
        })
      }
    }
  },
})
