// DO NOT EDIT. This is a generated file. Instead of this file, edit "issue-timeline.graphql".

export const IssueTimelineQuery = `#graphql
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
}` as string & IssueTimelineQuery

export type IssueTimelineQuery = (vars: {
  owner: string
  name: string
  number: number
  num?: number | null
  cursor?: string | null
}) => {
  repository: {
    issue: {
      timelineItems: {
        totalCount: number
        nodes: Array<
          | ({
              __typename: string
            } & {
              createdAt: string
              actor: {
                login: string
              } | null
            })
          | null
        > | null
        pageInfo: {
          hasNextPage: boolean
          endCursor: string | null
        }
      }
    } | null
  } | null
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  } | null
}
