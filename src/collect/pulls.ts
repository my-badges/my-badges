export const pullsQuery = `#graphql
query PullsQuery($username: String!, $num: Int = 100, $cursor: String) {
  user(login: $username) {
    pullRequests(first: $num, after: $cursor) {
      totalCount
      nodes {
        createdAt
        number
        title
        body
        closed
        merged
        mergedAt
        mergedBy {
          login
        }
        repository {
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
}
`

export type PullsQuery = {
  user: {
    pullRequests: {
      totalCount: number
      nodes: Array<{
        createdAt: string
        number: number
        title: string
        body: string
        closed: boolean
        merged: boolean
        mergedAt: string
        mergedBy?: {
          login: string
        }
        repository: {
          owner: {
            login: string
          }
          name: string
          languages: {
            totalCount: number
            nodes: Array<{
              name: string
            }>
          }
        }
        participants: {
          totalCount: number
          nodes: Array<{
            login: string
          }>
        }
        lastCommit: {
          nodes: Array<{
            commit: {
              checkSuites: {
                totalCount: number
                nodes: Array<{
                  app: {
                    name: string
                  }
                  workflowRun: {
                    workflow: {
                      name: string
                    }
                  }
                  lastCheckRun: {
                    totalCount: number
                    nodes: Array<{
                      name: string
                      conclusion:
                        | 'ACTION_REQUIRED'
                        | 'TIMED_OUT'
                        | 'CANCELLED'
                        | 'FAILURE'
                        | 'SUCCESS'
                        | 'NEUTRAL'
                        | 'SKIPPED'
                        | 'STARTUP_FAILURE'
                        | 'STALE'
                      status:
                        | 'COMPLETED'
                        | 'IN_PROGRESS'
                        | 'PENDING'
                        | 'QUEUED'
                        | 'REQUESTED'
                        | 'WAITING'
                      startedAt: string
                      completedAt: string
                    }>
                  }
                }>
              }
            }
          }>
        }
      }>
    }
    pageInfo: {
      hasNextPage: boolean
      endCursor: string
    }
  }
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  }
}
