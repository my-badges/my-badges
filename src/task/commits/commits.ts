import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import { CommitsQuery } from './commits.graphql.js'

export default task({
  name: 'commits' as const,
  run: async (
    { octokit, data, next },
    { owner, name }: { owner: string; name: string },
  ) => {
    console.log(`Loading commits for ${owner}/${name}`)
    const commits = paginate(octokit, CommitsQuery, {
      owner: owner,
      name: name,
      author: data.user.id,
    })

    const repo = data.repos.find(
      (repo) => repo.owner.login == owner && repo.name == name,
    )
    if (!repo) {
      throw new Error(`Repo not found: ${owner}/${name}`)
    }
    repo.commits = []

    for await (const resp of commits) {
      const { totalCount, nodes } =
        resp.repository?.defaultBranchRef?.target?.history!

      if (!nodes) {
        throw new Error('Failed to load commits')
      }

      if (totalCount >= 10_000) {
        console.error(
          `Too many commits for ${owner}/${name}: ${totalCount} commits; My-Badges will skip repos with more than 10k commits.`,
        )
        break
      }

      const repo = data.repos.find(
        (repo) => repo.owner.login == owner && repo.name == name,
      )
      if (!repo) {
        throw new Error(`Repo not found: ${owner}/${name}`)
      }

      for (const commit of nodes) {
        repo.commits.push(commit)
      }
      console.log(
        `| commits ${repo.commits.length}/${totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
    }
  },
})
