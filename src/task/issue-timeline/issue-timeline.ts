import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import { IssueTimelineQuery } from './issue-timeline.graphql.js'

export default task({
  name: 'issue-timeline' as const,
  run: async ({ octokit, data, next }, { id }: { id: string }) => {
    const timeline = paginate(octokit, IssueTimelineQuery, {
      id,
    })

    const issue = data.issues.find((x) => x.id === id)
    if (!issue) {
      throw new Error(`Issue ${id} not found`)
    }

    for await (const resp of timeline) {
      if (!resp.node?.timelineItems.nodes) {
        throw new Error('Failed to load issue timeline')
      }

      octokit.log.info(
        `| timeline ${resp.node.timelineItems.nodes.length}/${resp.node.timelineItems.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
      for (const event of resp.node.timelineItems.nodes) {
        if (event?.__typename == 'ClosedEvent') {
          issue.closedBy = event.actor?.login
        }
      }
    }
  },
})
