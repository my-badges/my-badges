import { Octokit } from 'octokit'
import { Endpoints } from '@octokit/types'
import { pullsQuery, PullsQuery } from './pulls.js'
import { commitsQuery, CommitsQuery } from './commits.js'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { issuesQuery, IssuesQuery } from './issues.js'
import { userQuery, UserQuery } from './user.js'
import { IssueTimelineQuery, issueTimelineQuery } from './issue-timeline.js'

export type Data = {
  user: User
  repos: Repo[]
  pulls: Pull[]
  issues: Issue[]
}
export type User = UserQuery['user']
export type Repo =
  Endpoints['GET /users/{username}/repos']['response']['data'][0] & {
    commits: Commit[]
  }
export type Commit =
  CommitsQuery['repository']['defaultBranchRef']['target']['history']['nodes'][0]
export type Pull = PullsQuery['user']['pullRequests']['nodes'][0]
export type Issue = IssuesQuery['user']['issues']['nodes'][0]

export async function collect(
  octokit: Octokit,
  username: string,
): Promise<Data> {
  const { user } = await octokit.graphql<UserQuery>(userQuery, {
    login: username,
  })

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
      const commits = octokit.graphql.paginate.iterator<CommitsQuery>(
        commitsQuery,
        {
          owner: repo.owner.login,
          name: repo.name,
          author: user.id,
        },
      )

      for await (const resp of commits) {
        const { totalCount, nodes } =
          resp.repository.defaultBranchRef.target.history
        console.log(
          `| commits ${nodes.length}/${totalCount} (cost: ${resp.rateLimit.cost}, remaining: ${resp.rateLimit.remaining})`,
        )
        for (const commit of nodes) {
          repo.commits.push(commit)
        }
      }
    } catch (err) {
      console.error(
        `Failed to load commits for ${repo.owner.login}/${repo.name}`,
      )
      console.error(err)
    }
  }

  const pulls = octokit.graphql.paginate.iterator<PullsQuery>(pullsQuery, {
    username,
  })
  try {
    for await (const resp of pulls) {
      console.log(
        `Loading pull requests ${
          data.pulls.length + resp.user.pullRequests.nodes.length
        }/${resp.user.pullRequests.totalCount} (cost: ${
          resp.rateLimit.cost
        }, remaining: ${resp.rateLimit.remaining})`,
      )
      for (const pull of resp.user.pullRequests.nodes) {
        data.pulls.push(pull)
      }
    }
  } catch (err) {
    console.error(`Failed to load pull requests`)
    console.error(err)
  }

  const issues = octokit.graphql.paginate.iterator<IssuesQuery>(issuesQuery, {
    username,
  })
  try {
    for await (const resp of issues) {
      console.log(
        `Loading issues ${data.issues.length + resp.user.issues.nodes.length}/${
          resp.user.issues.totalCount
        } (cost: ${resp.rateLimit.cost}, remaining: ${
          resp.rateLimit.remaining
        })`,
      )
      for (const issue of resp.user.issues.nodes) {
        data.issues.push(issue)
      }
    }
  } catch (err) {
    console.error(`Failed to load issues`)
    console.error(err)
  }

  for (const issue of data.issues) {
    console.log(
      `Loading issue timeline for ${issue.repository.name}#${issue.number}`,
    )
    try {
      const timeline = octokit.graphql.paginate.iterator<IssueTimelineQuery>(
        issueTimelineQuery,
        {
          owner: issue.repository.owner.login,
          name: issue.repository.name,
          number: issue.number,
        },
      )
      for await (const resp of timeline) {
        console.log(
          `| timeline ${resp.repository.issue.timelineItems.nodes.length}/${resp.repository.issue.timelineItems.totalCount} (cost: ${resp.rateLimit.cost}, remaining: ${resp.rateLimit.remaining})`,
        )
        for (const event of resp.repository.issue.timelineItems.nodes) {
          if (event.__typename == 'ClosedEvent') {
            issue.closedAt = event.createdAt
            issue.closedBy = event.actor.login
          }
        }
      }
    } catch (err) {
      console.error(
        `Failed to load issue timeline for ${issue.repository.name}#${issue.number}`,
      )
      console.error(err)
    }
  }

  return data
}
