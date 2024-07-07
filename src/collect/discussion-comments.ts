import { Reactions } from './types.js'

export const discussionCommentsQuery = `#graphql
query DiscussionCommentsQuery($login: String!, $num: Int = 100, $cursor: String) {
  user(login: $login) {
    repositoryDiscussionComments(first: $num, after: $cursor) {
      totalCount
      nodes {
        url
        author {
          login
        }
        discussion {
          number
          repository {
            nameWithOwner
          }
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

export type DiscussionCommentsQuery = {
  user: {
    repositoryDiscussionComments: {
      totalCount: number
      nodes: Array<{
        url: string
        author: {
          login: string
        }
        discussion: {
          number: number
          repository: {
            nameWithOwner: string
          }
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
