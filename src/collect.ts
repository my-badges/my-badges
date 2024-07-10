import { Octokit } from 'octokit'
import { Data } from './collect/index.js'
import { Query, Variables } from 'megaera'
import { UserQuery } from './collect/user.graphql.js'
import { CommitsQuery } from './collect/commits.graphql.js'
import { PullsQuery } from './collect/pulls.graphql.js'
import { IssuesQuery } from './collect/issues.graphql.js'
import { IssueTimelineQuery } from './collect/issue-timeline.graphql.js'
import {
  DiscussionCommentsQuery,
  IssueCommentsQuery,
} from './collect/comments.graphql.js'
import { StarsQuery } from './collect/stars.graphql.js'

export async function collect(
  octokit: Octokit,
  username: string,
): Promise<Data> {
  function query<T extends Query>(query: T, variables: Variables<T>) {
    return octokit.graphql<ReturnType<T>>(query, variables)
  }

  function paginate<T extends Query>(query: T, variables: Variables<T>) {
    return octokit.graphql.paginate.iterator<ReturnType<T>>(query, variables)
  }

  const { user } = await query(UserQuery, {
    login: username,
  })!

  if (!user) {
    throw new Error('Failed to load user')
  }

  const data: Data = {
    user: user,
    starredRepositories: [],
    repos: [],
    pulls: [],
    issues: [],
    issueComments: [],
    discussionComments: [],
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
      const commits = paginate(CommitsQuery, {
        owner: repo.owner.login,
        name: repo.name,
        author: user.id,
      })

      for await (const resp of commits) {
        const { totalCount, nodes } =
          resp.repository?.defaultBranchRef?.target?.history!

        if (!nodes) {
          throw new Error('Failed to load commits')
        }

        if (totalCount >= 10_000) {
          console.error(
            `Too many commits for ${repo.owner.login}/${repo.name}: ${totalCount} commits; My-Badges will skip repos with more than 10k commits.`,
          )
          break
        }

        for (const commit of nodes) {
          repo.commits.push(commit)
        }
        console.log(
          `| commits ${repo.commits.length}/${totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
        )
      }
    } catch (err) {
      console.error(
        `Failed to load commits for ${repo.owner.login}/${repo.name}`,
      )
      console.error(err)
    }
  }

  const pulls = paginate(PullsQuery, {
    username,
  })
  try {
    for await (const resp of pulls) {
      if (!resp.user?.pullRequests.nodes) {
        throw new Error('Failed to load pull requests')
      }

      console.log(
        `Loading pull requests ${
          data.pulls.length + resp.user.pullRequests.nodes.length
        }/${resp.user.pullRequests.totalCount} (cost: ${
          resp.rateLimit?.cost
        }, remaining: ${resp.rateLimit?.remaining})`,
      )
      for (const pull of resp.user.pullRequests.nodes) {
        data.pulls.push(pull)
      }
    }
  } catch (err) {
    console.error(`Failed to load pull requests`)
    console.error(err)
  }

  const issues = paginate(IssuesQuery, {
    username,
  })
  try {
    for await (const resp of issues) {
      if (!resp.user?.issues.nodes) {
        throw new Error('Failed to load issues')
      }

      console.log(
        `Loading issues ${data.issues.length + resp.user.issues.nodes.length}/${
          resp.user.issues.totalCount
        } (cost: ${resp.rateLimit?.cost}, remaining: ${
          resp.rateLimit?.remaining
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
      const timeline = paginate(IssueTimelineQuery, {
        owner: issue.repository.owner.login,
        name: issue.repository.name,
        number: issue.number,
      })
      for await (const resp of timeline) {
        if (!resp.repository?.issue?.timelineItems.nodes) {
          throw new Error('Failed to load issue timeline')
        }

        console.log(
          `| timeline ${resp.repository.issue.timelineItems.nodes.length}/${resp.repository.issue.timelineItems.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
        )
        for (const event of resp.repository.issue.timelineItems.nodes) {
          if (event?.__typename == 'ClosedEvent') {
            issue.closedAt = event.createdAt
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

  const issueComments = paginate(IssueCommentsQuery, {
    login: username,
  })
  try {
    for await (const resp of issueComments) {
      if (!resp.user?.issueComments.nodes) {
        throw new Error('Failed to load issue comments')
      }

      for (const comment of resp.user.issueComments.nodes) {
        data.issueComments.push(comment)
      }
      console.log(
        `| issue comments ${data.issueComments.length}/${resp.user.issueComments.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
    }
  } catch (err) {
    console.error(`Failed to load issue comments`)
    console.error(err)
  }

  const discussionComments = paginate(DiscussionCommentsQuery, {
    login: username,
  })
  try {
    for await (const resp of discussionComments) {
      if (!resp.user?.repositoryDiscussionComments.nodes) {
        throw new Error('Failed to load discussion comments')
      }

      for (const comment of resp.user.repositoryDiscussionComments.nodes) {
        data.discussionComments.push(comment)
      }
      console.log(
        `| discussion comments ${data.discussionComments.length}/${resp.user.repositoryDiscussionComments.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
    }
  } catch (err) {
    console.error(`Failed to load discussion comments`)
    console.error(err)
  }

  const stars = paginate(StarsQuery, {
    login: username,
  })
  try {
    for await (const resp of stars) {
      if (!resp.user?.starredRepositories.nodes) {
        throw new Error('Failed to load stars')
      }

      for (const repo of resp.user.starredRepositories.nodes) {
        data.starredRepositories.push(repo)
      }
      console.log(
        `| stars ${data.starredRepositories.length}/${resp.user.starredRepositories.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
    }
  } catch (err) {
    console.error(`Failed to load stars`)
    console.error(err)
  }

  return data
}
