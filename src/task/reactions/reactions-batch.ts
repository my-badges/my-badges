import { task } from '../../task.js'
import { paginate, query } from '../../utils.js'
import { ReactionsBatchQuery, ReactionsQuery } from './reactions.graphql.js'

export default task({
  name: 'reactions-batch' as const,
  run: async ({ octokit, data }, { ids }: { ids: string[] }) => {
    const { nodes, rateLimit } = await query(octokit, ReactionsBatchQuery, {
      ids,
    })

    console.log(
      `| reactions batch ${nodes.length} (cost: ${rateLimit?.cost}, remaining: ${rateLimit?.remaining})`,
    )
    for (const node of nodes) {
      if (node.__typename === 'Issue') {
        const issue = data.issues.find((x) => x.id === node.id)
        if (issue) {
          issue.reactions = node.reactions.nodes ?? undefined
        }
      }
      if (node.__typename === 'PullRequest') {
        const pull = data.pulls.find((x) => x.id === node.id)
        if (pull) {
          pull.reactions = node.reactions.nodes ?? undefined
        }
      }
      if (node.__typename === 'DiscussionComment') {
        const discussionComment = data.discussionComments.find(
          (x) => x.id === node.id,
        )
        if (discussionComment) {
          discussionComment.reactions = node.reactions.nodes ?? undefined
        }
      }
      if (node.__typename === 'IssueComment') {
        const issueComment = data.issueComments.find((x) => x.id === node.id)
        if (issueComment) {
          issueComment.reactions = node.reactions.nodes ?? undefined
        }
      }
    }
  },
})
