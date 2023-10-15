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
