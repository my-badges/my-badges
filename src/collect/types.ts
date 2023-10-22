import { Endpoints } from '@octokit/types'
import { CommitsQuery } from './commits.js'
import { IssuesQuery } from './issues.js'
import { UserQuery } from './user.js'
import { PullsQuery } from './pulls.js'

export type Extra<T> = T | undefined

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
