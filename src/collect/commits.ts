export type CommitsQuery = {
  repository: {
    defaultBranchRef: {
      target: {
        history: {
          totalCount: number
          nodes: Array<{
            sha: string
            message: string
            messageBody: string
            additions: number
            deletions: number
            repository: {
              owner: {
                login: string
              }
              name: string
            }
          }>
          pageInfo: {
            hasNextPage: boolean
            endCursor: string
          }
        }
      }
    }
  }
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  }
}
