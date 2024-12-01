import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import {
  IssueCommentsReactionsQuery,
  IssueReactionsQuery,
} from './reactions.graphql.js'

export default task({
  name: 'issue-comments-reactions' as const,
  run: async ({ octokit, data }, { id }: { id: string }) => {
    const issueReactions = paginate(octokit, IssueCommentsReactionsQuery, {
      id: id,
    })

    const issueComment = data.issueComments.find((x) => x.id === id)
    if (!issueComment) {
      throw new Error(`Issue comment ${id} not found`)
    }

    issueComment.reactions = []

    for await (const resp of issueReactions) {
      if (!resp.node?.reactions.nodes) {
        throw new Error('Failed to load issue comment reactions')
      }

      for (const reaction of resp.node.reactions.nodes) {
        issueComment.reactions.push(reaction)
      }

      console.log(
        `| issue comment reactions ${issueComment.reactions.length}/${resp.node.reactions.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
    }
  },
})
