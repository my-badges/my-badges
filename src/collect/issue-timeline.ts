export const issueTimelineQuery = `#graphql
query IssueTimelineQuery($owner: String!, $name: String!, $number: Int!, $num: Int = 100, $cursor: String) {
  repository(owner: $owner, name: $name) {
    issue(number: $number) {
      timelineItems(first: $num, after: $cursor) {
        totalCount
        nodes {
          __typename
          ... on ClosedEvent {
            createdAt
            actor {
              login
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
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

export type IssueTimelineQuery = {
  repository: {
    issue: {
      timelineItems: {
        totalCount: number
        nodes: Array<{
          __typename: string
          createdAt: string
          actor: {
            login: string
          }
        }>
        pageInfo: {
          hasNextPage: boolean
          endCursor: string
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
