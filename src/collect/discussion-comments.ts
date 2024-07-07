export const discussionCommentsQuery = `#graphql
query DiscussionCommentsQuery($login: String!, $num: Int = 100, $cursor: String) {
  user(login: $login) {
    repositoryDiscussionComments(first: $num, after: $cursor) {
      totalCount
      nodes {
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
        reactions: {
          totalCount: number
          nodes: Array<{
            content:
              | 'CONFUSED'
              | 'EYES'
              | 'HEART'
              | 'HOORAY'
              | 'LAUGH'
              | 'ROCKET'
              | 'THUMBS_DOWN'
              | 'THUMBS_UP'
            user: {
              login: string
            }
          }>
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
