import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import { IssueCommentsQuery } from './comments.graphql.js'

export default task({
  name: 'issue-comments' as const,
  run: async ({ octokit, data, batch }, { username }: { username: string }) => {
    const issueComments = paginate(octokit, IssueCommentsQuery, {
      login: username,
    })

    data.issueComments = []

    const batchReactions = batch('reactions-issue-comments', 'reactions-batch')

    for await (const resp of issueComments) {
      if (!resp.user?.issueComments.nodes) {
        throw new Error('Failed to load issue comments')
      }

      for (const comment of resp.user.issueComments.nodes) {
        data.issueComments.push(comment)
        batchReactions(comment.reactionsTotal.totalCount, comment.id)
      }

      octokit.log.info(
        `| issue comments ${data.issueComments.length}/${resp.user.issueComments.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
    }
  },
})
