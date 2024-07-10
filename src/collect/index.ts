import { Endpoints } from '@octokit/types'
import { User } from './user.graphql.js'
import { PullRequest } from './pulls.graphql.js'
import { Issue } from './issues.graphql.js'
import { DiscussionComment, IssueComment } from './comments.graphql.js'
import { StarredRepo } from './stars.graphql.js'
import { Commit } from './commits.graphql.js'

export type Data = {
  user: User
  starredRepositories: StarredRepo[]
  repos: Repo[]
  pulls: PullRequest[]
  issues: Issue[]
  issueComments: IssueComment[]
  discussionComments: DiscussionComment[]
}

export type Repo =
  Endpoints['GET /users/{username}/repos']['response']['data'][0] & {
    commits: Commit[]
  }
