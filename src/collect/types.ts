import { Endpoints } from '@octokit/types'
import { CommitsQuery } from './commits.js'
import { IssuesQuery } from './issues.js'
import { UserQuery } from './user.js'
import { PullsQuery } from './pulls.js'
import { IssueCommentsQuery } from './issue-comments.js'
import { DiscussionCommentsQuery } from './discussion-comments.js'

// Extra<T> represents additional data that is not returned by the GraphQL API,
// but enriched by some other means (e.g., separate queries).
export type Extra<T> = T | undefined

export type Data = {
  user: User
  repos: Repo[]
  pulls: Pull[]
  issues: Issue[]
  issueComments: IssueComment[]
  discussionComments: DiscussionComment[]
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

export type IssueComment =
  IssueCommentsQuery['user']['issueComments']['nodes'][0]

export type DiscussionComment =
  DiscussionCommentsQuery['user']['repositoryDiscussionComments']['nodes'][0]
