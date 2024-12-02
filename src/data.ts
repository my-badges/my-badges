import { User } from './task/user/user.graphql.js'
import { PullRequest as PullRequestType } from './task/pulls/pulls.graphql.js'
import { Issue as IssueType } from './task/issues/issues.graphql.js'
import {
  DiscussionComment as DiscussionCommentType,
  IssueComment as IssueCommentType,
} from './task/comments/comments.graphql.js'
import { StarredRepo } from './task/stars/stars.graphql.js'
import { Commit } from './task/commits/commits.graphql.js'
import { Reaction } from './task/reactions/reactions.graphql.js'
import { Repository as RepositoryType } from './task/repos/repos.graphql.js'

// Data is collected by tasks, enriched if needed, and saved to disk.
// Use this data to determine which badges to present to the user.
export type Data = {
  user: User
  starredRepositories: StarredRepo[]
  repos: Repository[]
  pulls: PullRequest[]
  issues: Issue[]
  issueComments: IssueComment[]
  discussionComments: DiscussionComment[]
}

export type Repository = {
  commits: Commit[]
} & RepositoryType

export type Issue = {
  closedBy?: string
  reactions?: Reaction[]
} & IssueType

export type PullRequest = {
  reactions?: Reaction[]
} & PullRequestType

export type IssueComment = {
  reactions?: Reaction[]
} & IssueCommentType

export type DiscussionComment = {
  reactions?: Reaction[]
} & DiscussionCommentType
