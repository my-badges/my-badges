import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import { IssueTimelineQuery } from './issue-timeline.graphql.js'

export default task({
  name: 'issue-timeline' as const,
  run: async (
    { octokit, data, next },
    { owner, name, number }: { owner: string; name: string; number: number },
  ) => {
    console.log(`Loading issue timeline for ${name}#${number}`)
    const timeline = paginate(octokit, IssueTimelineQuery, {
      owner: owner,
      name: name,
      number: number,
    })

    const issue = data.issues.find((x) => x.number === number)
    if (!issue) {
      throw new Error(`Issue ${number} not found`)
    }

    for await (const resp of timeline) {
      if (!resp.repository?.issue?.timelineItems.nodes) {
        throw new Error('Failed to load issue timeline')
      }

      console.log(
        `| timeline ${resp.repository.issue.timelineItems.nodes.length}/${resp.repository.issue.timelineItems.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
      for (const event of resp.repository.issue.timelineItems.nodes) {
        if (event?.__typename == 'ClosedEvent') {
          issue.closedBy = event.actor?.login
        }
      }
    }
  },
})
