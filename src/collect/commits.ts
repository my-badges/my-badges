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
          }>
          pageInfo: {
            hasNextPage: boolean
            endCursor: string
          }
        }
      }
    }
  }
}
