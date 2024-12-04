import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import { ReposQuery } from './repos.graphql.js'

export default task({
  name: 'repos' as const,
  run: async (
    { octokit, data, batch },
    { username, author }: { username: string; author: string },
  ) => {
    const repos = paginate(octokit, ReposQuery, { login: username, author })

    data.repos = []

    const batchCommits = batch('commits', 'commits-batch', 8)

    for await (const resp of repos) {
      if (!resp.user?.repositories.nodes) {
        throw new Error('Failed to load repos')
      }

      for (const repo of resp.user.repositories.nodes) {
        data.repos.push({ ...repo, commits: [] })

        const commitCount =
          repo.defaultBranchRef?.target?.history.totalCount ?? 0
        if (commitCount >= 10_000) {
          octokit.log.error(
            `Too many commits for ${repo.owner.login}/${repo.name}: ${commitCount} commits; My-Badges will skip repos with more than 10k commits.`,
          )
        } else {
          batchCommits(commitCount, repo.id)
        }
      }
      octokit.log.info(
        `| repos ${data.repos.length}/${resp.user.repositories.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
    }
  },
})
