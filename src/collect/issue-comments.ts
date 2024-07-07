import { Reactions } from './types.js'

export const issueCommentsQuery = `#graphql
query IssueCommentsQuery($login: String!, $num: Int = 100, $cursor: String) {
  user(login: $login) {
    issueComments(first: $num, after: $cursor) {
      totalCount
      nodes {
        url
        author {
          login
        }
        repository {
          nameWithOwner
        }
        issue {
          number
          author {
            login
          }
        }
        body
        createdAt
        updatedAt
        editor {
          login
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

export type IssueCommentsQuery = {
  user: {
    issueComments: {
      totalCount: number
      nodes: Array<{
        url: string
        author: {
          login: string
        }
        repository: {
          nameWithOwner: string
        }
        issue: {
          number: number
          author: {
            login: string
          }
        }
        body: string
        createdAt: string
        updatedAt: string
        editor: {
          login: string
        } | null
        reactions: Reactions
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
