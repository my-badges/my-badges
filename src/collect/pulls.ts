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
