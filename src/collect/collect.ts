import {Octokit} from 'octokit'
import {Endpoints} from '@octokit/types'
import {PullsQuery} from './pulls.js'
import {CommitsQuery} from './commits.js'
import fs from 'node:fs'
import {fileURLToPath} from 'url'
import {IssuesQuery} from './issues.js'

export type Data = {
  user: User
  repos: Repo[]
  pulls: Pull[]
  issues: Issues[]
}
export type User = Endpoints['GET /users/{username}']['response']['data']
export type Repo = Endpoints['GET /users/{username}/repos']['response']['data'][0] & {
  commits: Commit[]
}
export type Commit = CommitsQuery['repository']['defaultBranchRef']['target']['history']['nodes'][0]
export type Pull = PullsQuery['user']['pullRequests']['nodes'][0]
export type Issues = IssuesQuery['user']['issues']['nodes'][0]

export async function collect(username: string, octokit: Octokit): Promise<Data> {
  const user = (await octokit.request('GET /users/{username}', {username})).data

  const data: Data = {
    user: user,
    repos: [],
    pulls: [],
    issues: [],
  }

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
    }
  }

  for (const repo of data.repos) {
    console.log(`Loading commits for ${repo.owner.login}/${repo.name}`)
    try {
      const commits = octokit.graphql.paginate.iterator<CommitsQuery>(loadGraphql('./commits.graphql'), {
        owner: repo.owner.login,
        name: repo.name,
        author: user.node_id,
      })

      for await (const resp of commits) {
        const {totalCount, nodes} = resp.repository.defaultBranchRef.target.history
        console.log(`| commits ${nodes.length}/${totalCount} (cost: ${resp.rateLimit.cost}, remaining: ${resp.rateLimit.remaining})`)
        for (const commit of nodes) {
          repo.commits.push(commit)
        }
      }
    } catch (err) {
      console.error(`Failed to load commits for ${repo.owner.login}/${repo.name}`)
      console.error(err)
    }
  }

  const pulls = octokit.graphql.paginate.iterator<PullsQuery>(loadGraphql('./pulls.graphql'), {
    username,
  })
  for await (const resp of pulls) {
    console.log(`Loading pull requests ${data.pulls.length + resp.user.pullRequests.nodes.length}/${resp.user.pullRequests.totalCount} (cost: ${resp.rateLimit.cost}, remaining: ${resp.rateLimit.remaining})`)
    for (const pull of resp.user.pullRequests.nodes) {
      data.pulls.push(pull)
    }
  }

  const issues = octokit.graphql.paginate.iterator<IssuesQuery>(loadGraphql('./issues.graphql'), {
    username,
  })
  for await (const resp of issues) {
    console.log(`Loading issues ${data.issues.length + resp.user.issues.nodes.length}/${resp.user.issues.totalCount} (cost: ${resp.rateLimit.cost}, remaining: ${resp.rateLimit.remaining})`)
    for (const issue of resp.user.issues.nodes) {
      data.issues.push(issue)
    }
  }

  return data
}

function loadGraphql(file: string): string {
  return fs.readFileSync(fileURLToPath(new URL(file, import.meta.url)), 'utf8')
}
