export const commitsQuery = `#graphql
query CommitsQuery(
  $owner: String!
  $name: String!
  $author: ID!
  $num: Int = 100
  $cursor: String
) {
  repository(owner: $owner, name: $name) {
    defaultBranchRef {
      target {
        ... on Commit {
          history(first: $num, after: $cursor, author: { id: $author }) {
            totalCount
            nodes {
              sha: oid
              committedDate
              message
              messageBody
              additions
              deletions
              repository {
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

export type CommitsQuery = {
  repository: {
    defaultBranchRef: {
      target: {
        history: {
          totalCount: number
          nodes: Array<{
            sha: string
            committedDate: string
            message: string
            messageBody: string
            additions: number
            deletions: number
            repository: {
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
    }
  }
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  }
}
