// DO NOT EDIT. This is a generated file. Instead of this file, edit "issue-timeline.graphql".

const IssueTimelineItem = `#graphql
fragment IssueTimelineItem on IssueTimelineItem {
  __typename
  ... on ClosedEvent {
    createdAt
    actor {
      login
    }
  }
}`

export type IssueTimelineItem =
  | ({
      __typename: string
    } & {
      createdAt: string
      actor: {
        login: string
      } | null
    })
  | null

export const IssueTimelineQuery = `#graphql
${IssueTimelineItem}
query IssueTimelineQuery($owner: String!, $name: String!, $number: Int!, $num: Int = 100, $cursor: String) {
  repository(owner: $owner, name: $name) {
    issue(number: $number) {
      timelineItems(first: $num, after: $cursor) {
        totalCount
        nodes {
          ...IssueTimelineItem
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
        nodes: Array<{} & IssueTimelineItem> | null
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

export const IssueTimelineBatchQuery = `#graphql
${IssueTimelineItem}
query IssueTimelineBatchQuery($ids: [ID!]!) {
  nodes(ids: $ids) {
    __typename
    ... on Issue {
      id
      timelineItems(first: 100) {
        totalCount
        nodes {
          ...IssueTimelineItem
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
}` as string & IssueTimelineBatchQuery

export type IssueTimelineBatchQuery = (vars: { ids: string[] }) => {
  nodes: Array<
    | ({
        __typename: string
      } & {
        id: string
        timelineItems: {
          totalCount: number
          nodes: Array<{} & IssueTimelineItem> | null
        }
      })
    | null
  >
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  } | null
}
