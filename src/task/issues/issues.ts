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

    let reactionsBatch: string[] = []
    let issueTimelineBatch: string[] = []

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

        if (issue.reactionsTotal.totalCount > 0) {
          if (reactionsBatch.length > 100) {
            next('reactions-issue', {
              id: issue.id,
            })
          } else {
            reactionsBatch.push(issue.id)
            if (reactionsBatch.length === 50) {
              next('reactions-batch', {
                ids: reactionsBatch,
              })
              reactionsBatch = []
            }
          }
        }

        if (issue.timelineItemsTotal.totalCount > 0) {
          if (issue.timelineItemsTotal.totalCount > 100) {
            next('issue-timeline-batch', {
              ids: issueTimelineBatch,
            })
          } else {
            issueTimelineBatch.push(issue.id)
            if (issueTimelineBatch.length === 50) {
              next('issue-timeline-batch', {
                ids: issueTimelineBatch,
              })
              issueTimelineBatch = []
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

    if (issueTimelineBatch.length > 0) {
      next('issue-timeline-batch', {
        ids: issueTimelineBatch,
      })
    }
  },
})
