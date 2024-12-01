import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import { IssueCommentsQuery } from './comments.graphql.js'

export default task({
  name: 'issue-comments' as const,
  run: async ({ octokit, data, next }, { username }: { username: string }) => {
    const issueComments = paginate(octokit, IssueCommentsQuery, {
      login: username,
    })

    data.issueComments = []

    for await (const resp of issueComments) {
      if (!resp.user?.issueComments.nodes) {
        throw new Error('Failed to load issue comments')
      }

      for (const comment of resp.user.issueComments.nodes) {
        data.issueComments.push(comment)
        if (comment.reactionsTotal.totalCount > 0) {
          next('reactions-issue-comments', {
            id: comment.id,
          })
        }
      }

      console.log(
        `| issue comments ${data.issueComments.length}/${resp.user.issueComments.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
    }
  },
})
