// DO NOT EDIT. This is a generated file. Instead of this file, edit "repos.graphql".

const Repository = `#graphql
fragment Repository on Repository {
  id
  name
  owner {
    login
  }
  url
  description
  createdAt
  updatedAt
  languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
    totalCount
    nodes {
      name
    }
  }
  forks {
    totalCount
  }
  stargazers {
    totalCount
  }
  defaultBranchRef {
    name
    target {
      ... on Commit {
        history(author: {id: $author}) {
          totalCount
        }
      }
    }
  }
}`

export type Repository = {
  id: string
  name: string
  owner: {
    login: string
  }
  url: string
  description: string | null
  createdAt: string
  updatedAt: string
  languages: {
    totalCount: number
    nodes: Array<{
      name: string
    }> | null
  } | null
  forks: {
    totalCount: number
  }
  stargazers: {
    totalCount: number
  }
  defaultBranchRef: {
    name: string
    target:
      | ({} & {
          history: {
            totalCount: number
          }
        })
      | null
      | null
  } | null
}

export const ReposQuery = `#graphql
${Repository}
query ReposQuery($login: String!, $author: ID!, $num: Int = 50, $cursor: String) {
  user(login: $login) {
    repositories(
      first: $num
      after: $cursor
      orderBy: {field: CREATED_AT, direction: DESC}
      privacy: PUBLIC
    ) {
      totalCount
      nodes {
        ...Repository
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  rateLimit {
    cost
    remaining
    resetAt
    limit
  }
}` as string & ReposQuery

export type ReposQuery = (vars: {
  login: string
  author: string
  num?: number | null
  cursor?: string | null
}) => {
  user: {
    repositories: {
      totalCount: number
      nodes: Array<{} & Repository> | null
      pageInfo: {
        hasNextPage: boolean
        endCursor: string | null
      }
    }
  } | null
  rateLimit: {
    cost: number
    remaining: number
    resetAt: string
    limit: number
  } | null
}
