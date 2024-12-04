import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import { IssuesQuery } from './issues.graphql.js'

export default task({
  name: 'issues' as const,
  run: async ({ octokit, data, batch }, { username }: { username: string }) => {
    const issues = paginate(octokit, IssuesQuery, {
      username,
    })

    data.issues = []

    const batchReactions = batch('reactions-issue', 'reactions-batch')
    const batchIssueTimeline = batch('issue-timeline', 'issue-timeline-batch')

    for await (const resp of issues) {
      if (!resp.user?.issues.nodes) {
        throw new Error('Failed to load issues')
      }

      octokit.log.info(
        `| issues ${data.issues.length + resp.user.issues.nodes.length}/${
          resp.user.issues.totalCount
        } (cost: ${resp.rateLimit?.cost}, remaining: ${
          resp.rateLimit?.remaining
        })`,
      )
      for (const issue of resp.user.issues.nodes) {
        data.issues.push(issue)
        batchReactions(issue.reactionsTotal.totalCount, issue.id)
        batchIssueTimeline(issue.timelineItemsTotal.totalCount, issue.id)
      }
    }
  },
})
