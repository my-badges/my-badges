// DO NOT EDIT. This is a generated file. Instead of this file, edit "commits.graphql".

const Commit = `#graphql
fragment Commit on Commit {
  id
  sha: oid
  committedDate
  message
  messageBody
  additions
  deletions
  author {
    user {
      login
    }
  }
  committer {
    user {
      login
    }
  }
  repository {
    owner {
      login
    }
    name
  }
}`

export type Commit = {
  id: string
  sha: string
  committedDate: string
  message: string
  messageBody: string
  additions: number
  deletions: number
  author: {
    user: {
      login: string
    } | null
  } | null
  committer: {
    user: {
      login: string
    } | null
  } | null
  repository: {
    owner: {
      login: string
    }
    name: string
  }
}

const History = `#graphql
fragment History on Repository {
  defaultBranchRef {
    target {
      ... on Commit {
        history(first: $num, after: $cursor, author: {id: $author}) {
          totalCount
          nodes {
            ...Commit
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  }
}`

export type History = {
  defaultBranchRef: {
    target:
      | ({} & {
          history: {
            totalCount: number
            nodes: Array<{} & Commit> | null
            pageInfo: {
              hasNextPage: boolean
              endCursor: string | null
            }
          }
        })
      | null
      | null
  } | null
}

export const CommitsQuery = `#graphql
${Commit}
${History}
query CommitsQuery($id: ID!, $author: ID!, $num: Int = 100, $cursor: String) {
  node(id: $id) {
    ...History
  }
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
}` as string & CommitsQuery

export type CommitsQuery = (vars: {
  id: string
  author: string
  num?: number | null
  cursor?: string | null
}) => {
  node: ({} & History) | null
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  } | null
}

export const CommitsBatchQuery = `#graphql
${Commit}
${History}
query CommitsBatchQuery($ids: [ID!]!, $author: ID!, $num: Int = 100, $cursor: String) {
  nodes(ids: $ids) {
    id
    ...History
  }
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
}` as string & CommitsBatchQuery

export type CommitsBatchQuery = (vars: {
  ids: string[]
  author: string
  num?: number | null
  cursor?: string | null
}) => {
  nodes: Array<
    {
      id: string
    } & History
  >
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  } | null
}
