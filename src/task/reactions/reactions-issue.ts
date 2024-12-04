import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import { ReactionsQuery } from './reactions.graphql.js'

export default task({
  name: 'reactions-issue' as const,
  run: async ({ octokit, data }, { id }: { id: string }) => {
    const issueReactions = paginate(octokit, ReactionsQuery, {
      id,
    })

    const issue = data.issues.find((x) => x.id === id)
    if (!issue) {
      throw new Error(`Issue ${id} not found`)
    }

    issue.reactions = []

    for await (const resp of issueReactions) {
      if (!resp.node?.reactions.nodes) {
        throw new Error('Failed to load issue reactions')
      }

      for (const reaction of resp.node.reactions.nodes) {
        issue.reactions.push(reaction)
      }

      octokit.log.info(
        `| issue reactions ${data.issueComments.length}/${resp.node.reactions.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
    }
  },
})
