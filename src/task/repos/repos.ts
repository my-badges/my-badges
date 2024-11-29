import { task } from '../../task.js'

export default task({
  name: 'repos' as const,
  run: async ({ octokit, data, next }, { username }: { username: string }) => {
    const repos = octokit.paginate.iterator('GET /users/{username}/repos', {
      username,
      type: 'all',
      per_page: 100,
    })

    for await (const resp of repos) {
      for (const repo of resp.data) {
        if (repo.name == '-') {
          continue
        }
        data.repos.push({
          ...repo,
          commits: [],
        })
        next('commits', { owner: repo.owner.login, name: repo.name })
      }
    }
  },
})
