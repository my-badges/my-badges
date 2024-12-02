import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import { CommitsQuery } from './commits.graphql.js'

export default task({
  name: 'commits' as const,
  run: async ({ octokit, data }, { id }: { id: string }) => {
    const commits = paginate(octokit, CommitsQuery, {
      id,
      author: data.user.id,
    })

    const repo = data.repos.find((repo) => repo.id == id)
    if (!repo) {
      throw new Error(`Repo not found: ${id}`)
    }

    repo.commits = []

    for await (const resp of commits) {
      if (!resp.node?.defaultBranchRef?.target?.history) {
        throw new Error('Failed to load commits')
      }

      for (const commit of resp.node.defaultBranchRef.target.history.nodes ??
        []) {
        repo.commits.push(commit)
      }

      console.log(
        `| commits ${repo?.owner.login}/${repo?.name} ${repo.commits.length}/${resp.node.defaultBranchRef.target.history.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
    }
  },
})
