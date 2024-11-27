// DO NOT EDIT. This is a generated file. Instead of this file, edit "commits.graphql".

const Commit = `#graphql
fragment Commit on Commit {
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

export const CommitsQuery = `#graphql
${Commit}
query CommitsQuery($owner: String!, $name: String!, $author: ID!, $num: Int = 100, $cursor: String) {
  repository(owner: $owner, name: $name) {
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
  }
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
}` as string & CommitsQuery

export type CommitsQuery = (vars: {
  owner: string
  name: string
  author: string
  num?: number | null
  cursor?: string | null
}) => {
  repository: {
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
  } | null
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  } | null
}
