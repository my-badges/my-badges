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

const Reactions = `#graphql
fragment Reactions on Reactable {
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
}`

export type Reactions = {
  reactions: {
    totalCount: number
    nodes: Array<{} & Reaction> | null
    pageInfo: {
      hasNextPage: boolean
      endCursor: string | null
    }
  }
}

export const ReactionsQuery = `#graphql
${Reaction}
${Reactions}
query ReactionsQuery($id: ID!, $num: Int = 100, $cursor: String) {
  node(id: $id) {
    __typename
    ...Reactions
  }
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
}` as string & ReactionsQuery

export type ReactionsQuery = (vars: {
  id: string
  num?: number | null
  cursor?: string | null
}) => {
  node:
    | ({
        __typename: string
      } & Reactions)
    | null
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  } | null
}

export const ReactionsBatchQuery = `#graphql
${Reaction}
${Reactions}
query ReactionsBatchQuery($ids: [ID!]!, $num: Int = 100, $cursor: String) {
  nodes(ids: $ids) {
    __typename
    id
    ...Reactions
  }
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
}` as string & ReactionsBatchQuery

export type ReactionsBatchQuery = (vars: {
  ids: string[]
  num?: number | null
  cursor?: string | null
}) => {
  nodes: Array<
    {
      __typename: string
      id: string
    } & Reactions
  >
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  } | null
}
