import { task } from '../../task.js'
import { query } from '../../utils.js'
import { IssueTimelineBatchQuery } from './issue-timeline.graphql.js'

export default task({
  name: 'issue-timeline-batch' as const,
  run: async ({ octokit, data, next }, { ids }: { ids: string[] }) => {
    const resp = await query(octokit, IssueTimelineBatchQuery, {
      ids,
    })

    octokit.log.info(
      `| issue timeline batch ${resp.nodes.length} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
    )
    for (const node of resp.nodes) {
      if (node && node.__typename === 'Issue') {
        const issue = data.issues.find((x) => x.id === node.id)
        if (issue) {
          for (const event of node.timelineItems.nodes ?? []) {
            if (event?.__typename == 'ClosedEvent') {
              issue.closedAt = event.createdAt
            }
          }
        }
      }
    }
  },
})
