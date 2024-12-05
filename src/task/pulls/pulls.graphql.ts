// DO NOT EDIT. This is a generated file. Instead of this file, edit "pulls.graphql".

const PullRequest = `#graphql
fragment PullRequest on PullRequest {
  id
  createdAt
  url
  number
  title
  body
  closed
  merged
  mergedAt
  mergedBy {
    login
  }
  labels(first: 10) {
    totalCount
    nodes {
      name
    }
  }
  repository {
    isPrivate
    nameWithOwner
    owner {
      login
    }
    name
    languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
      totalCount
      nodes {
        name
      }
    }
  }
  participants(first: 20) {
    totalCount
    nodes {
      login
    }
  }
  lastCommit: commits(last: 1) {
    nodes {
      commit {
        checkSuites(first: 20) {
          totalCount
          nodes {
            app {
              name
            }
            workflowRun {
              workflow {
                name
              }
            }
            lastCheckRun: checkRuns(last: 1) {
              totalCount
              nodes {
                name
                conclusion
                status
                startedAt
                completedAt
              }
            }
          }
        }
      }
    }
  }
  reactionsTotal: reactions {
    totalCount
  }
}`

export type PullRequest = {
  id: string
  createdAt: string
  url: string
  number: number
  title: string
  body: string
  closed: boolean
  merged: boolean
  mergedAt: string | null
  mergedBy: {
    login: string
  } | null
  labels: {
    totalCount: number
    nodes: Array<{
      name: string
    }> | null
  } | null
  repository: {
    isPrivate: boolean
    nameWithOwner: string
    owner: {
      login: string
    }
    name: string
    languages: {
      totalCount: number
      nodes: Array<{
        name: string
      }> | null
    } | null
  }
  participants: {
    totalCount: number
    nodes: Array<{
      login: string
    }> | null
  }
  lastCommit: {
    nodes: Array<{
      commit: {
        checkSuites: {
          totalCount: number
          nodes: Array<{
            app: {
              name: string
            } | null
            workflowRun: {
              workflow: {
                name: string
              }
            } | null
            lastCheckRun: {
              totalCount: number
              nodes: Array<{
                name: string
                conclusion:
                  | 'ACTION_REQUIRED'
                  | 'CANCELLED'
                  | 'FAILURE'
                  | 'NEUTRAL'
                  | 'SKIPPED'
                  | 'STALE'
                  | 'STARTUP_FAILURE'
                  | 'SUCCESS'
                  | 'TIMED_OUT'
                status:
                  | 'COMPLETED'
                  | 'IN_PROGRESS'
                  | 'PENDING'
                  | 'QUEUED'
                  | 'REQUESTED'
                  | 'WAITING'
                startedAt: string | null
                completedAt: string | null
              }> | null
            } | null
          }> | null
        } | null
      }
    }> | null
  }
  reactionsTotal: {
    totalCount: number
  }
}

export const PullsQuery = `#graphql
${PullRequest}
query PullsQuery($username: String!, $num: Int = 30, $cursor: String) {
  user(login: $username) {
    pullRequests(first: $num, after: $cursor) {
      totalCount
      nodes {
        ...PullRequest
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
}` as string & PullsQuery

export type PullsQuery = (vars: {
  username: string
  num?: number | null
  cursor?: string | null
}) => {
  user: {
    pullRequests: {
      totalCount: number
      nodes: Array<{} & PullRequest> | null
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
