import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import { IssueReactionsQuery } from './reactions.graphql.js'

export default task({
  name: 'issue-reactions' as const,
  run: async (
    { octokit, data },
    { owner, name, number }: { owner: string; name: string; number: number },
  ) => {
    const issueReactions = paginate(octokit, IssueReactionsQuery, {
      owner,
      name,
      number,
    })

    const issue = data.issues.find((x) => x.number === number)
    if (!issue) {
      throw new Error(`Issue ${number} not found`)
    }

    issue.reactions = []

    for await (const resp of issueReactions) {
      if (!resp.repository?.issue?.reactions.nodes) {
        throw new Error('Failed to load issue reactions')
      }

      for (const reaction of resp.repository.issue.reactions.nodes) {
        issue.reactions.push(reaction)
      }

      console.log(
        `| issue comments ${data.issueComments.length}/${resp.repository.issue.reactions.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
    }
  },
})
