// DO NOT EDIT. This is a generated file. Instead of this file, edit "reactions.graphql".

const Reaction = `#graphql
fragment Reaction on Reaction {
  user {
    login
  }
  content
  createdAt
}`

export type Reaction = {
  user: {
    login: string
  } | null
  content:
    | 'CONFUSED'
    | 'EYES'
    | 'HEART'
    | 'HOORAY'
    | 'LAUGH'
    | 'ROCKET'
    | 'THUMBS_DOWN'
    | 'THUMBS_UP'
  createdAt: string
}

export const IssueReactionsQuery = `#graphql
${Reaction}
query IssueReactionsQuery($owner: String!, $name: String!, $number: Int!, $num: Int = 100, $cursor: String) {
  repository(owner: $owner, name: $name) {
    issue(number: $number) {
      reactions(first: $num, after: $cursor) {
        totalCount
        nodes {
          ...Reaction
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
}` as string & IssueReactionsQuery

export type IssueReactionsQuery = (vars: {
  owner: string
  name: string
  number: number
  num?: number | null
  cursor?: string | null
}) => {
  repository: {
    issue: {
      reactions: {
        totalCount: number
        nodes: Array<{} & Reaction> | null
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

export const IssueCommentsReactionsQuery = `#graphql
${Reaction}
query IssueCommentsReactionsQuery($id: ID!, $num: Int = 100, $cursor: String) {
  node(id: $id) {
    __typename
    ... on IssueComment {
      reactions(first: $num, after: $cursor) {
        totalCount
        nodes {
          ...Reaction
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
}` as string & IssueCommentsReactionsQuery

export type IssueCommentsReactionsQuery = (vars: {
  id: string
  num?: number | null
  cursor?: string | null
}) => {
  node:
    | ({
        __typename: string
      } & {
        reactions: {
          totalCount: number
          nodes: Array<{} & Reaction> | null
          pageInfo: {
            hasNextPage: boolean
            endCursor: string | null
          }
        }
      })
    | null
    | null
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  } | null
}
