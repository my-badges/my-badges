import { Extra, Reactions } from './types.js'

export const issuesQuery = `#graphql
query IssuesQuery($username: String!, $num: Int = 100, $cursor: String) {
  user(login: $username) {
    issues(first: $num, after: $cursor, filterBy: { createdBy: $username }) {
      totalCount
      nodes {
        createdAt
        closedAt
        closed
        author {
          login
        }
        url
        number
        title
        labels(first: 10) {
          totalCount
          nodes {
            name
          }
        }
        body
        comments(first: 1) {
          totalCount
        }
        reactions(first: 100) {
          totalCount
          nodes {
            content
            user {
              login
            }
          }
        }
        assignees(first: 3) {
          totalCount
        }
        repository {
          nameWithOwner
          owner {
            login
          }
          name
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
}
`

export type IssuesQuery = {
  user: {
    issues: {
      totalCount: number
      nodes: Array<{
        createdAt: string
        closedAt: string
        closed: boolean
        closedBy: Extra<string>
        author: {
          login: string
        }
        url: string
        number: number
        title: string
        labels: {
          totalCount: number
          nodes: Array<{
            name: string
          }>
        }
        body: string
        comments: {
          totalCount: number
        }
        reactions: Reactions
        assignees: {
          totalCount: number
        }
        repository: {
          nameWithOwner: string
          owner: {
            login: string
          }
          name: string
        }
      }>
      pageInfo: {
        hasNextPage: boolean
        endCursor: string
      }
    }
  }
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  }
}
