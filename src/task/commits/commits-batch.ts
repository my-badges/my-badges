import { task } from '../../task.js'
import { query } from '../../utils.js'
import { CommitsBatchQuery } from './commits.graphql.js'

export default task({
  name: 'commits-batch' as const,
  run: async ({ octokit, data }, { ids }: { ids: string[] }) => {
    const resp = await query(octokit, CommitsBatchQuery, {
      ids,
      author: data.user.id,
    })

    octokit.log.info(
      `| commits batch ${resp.nodes.length} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
    )

    for (const node of resp.nodes) {
      if (!node) {
        throw new Error('Failed to load commits')
      }

      const repo = data.repos.find((repo) => repo.id == node.id)
      if (!repo) {
        throw new Error(`Repo not found: ${node.id}`)
      }

      repo.commits = node.defaultBranchRef?.target?.history.nodes ?? []
    }
  },
})
