// DO NOT EDIT. This is a generated file. Instead of this file, edit "stars.graphql".

const StarredRepo = `#graphql
fragment StarredRepo on Repository {
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
}`

export type StarredRepo = {
  nameWithOwner: string
  description: string | null
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
    }> | null
  } | null
  licenseInfo: {
    name: string
    nickname: string | null
  } | null
}

export const StarsQuery = `#graphql
${StarredRepo}
query StarsQuery($login: String!, $num: Int = 100, $cursor: String) {
  user(login: $login) {
    starredRepositories(first: $num, after: $cursor) {
      totalCount
      isOverLimit
      nodes {
        ...StarredRepo
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
}` as string & StarsQuery

export type StarsQuery = (vars: {
  login: string
  num?: number | null
  cursor?: string | null
}) => {
  user: {
    starredRepositories: {
      totalCount: number
      isOverLimit: boolean
      nodes: Array<{} & StarredRepo> | null
      pageInfo: {
        hasNextPage: boolean
        endCursor: string | null
      }
    }
  } | null
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  } | null
}
