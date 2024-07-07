export const starsQuery = `#graphql
query StarsQuery($login: String!, $num: Int = 100, $cursor: String) {
  user(login: $login) {
    starredRepositories(first: $num, after: $cursor) {
      totalCount
      isOverLimit
      nodes {
        nameWithOwner
        description
        stargazers {
          totalCount
        }
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          totalCount
          edges {
            size
            node {
              name
            }
          }
        }
        licenseInfo {
          name
          nickname
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

export type StarsQuery = {
  user: {
    starredRepositories: {
      totalCount: number
      isOverLimit: boolean
      nodes: Array<{
        nameWithOwner: string
        description: string
        stargazers: {
          totalCount: number
        }
        languages: {
          totalCount: number
          edges: Array<{
            size: number
            node: {
              name: string
            }
          }>
        }
        licenseInfo: {
          name: string
          nickname: string
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
