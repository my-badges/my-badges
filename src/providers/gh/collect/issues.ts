export type IssuesQuery = {
  user: {
    issues: {
      totalCount: number
      nodes: Array<{
        createdAt: string
        closedAt: string
        closed: boolean
        author: {
          login: string
        }
        number: number
        title: string
        labels: {
          totalCount: number
          nodes: Array<{
            name: string
          }>
        }
        body: string
        comments: {
          totalCount: number
        }
        reactions: {
          totalCount: number
        }
        assignees: {
          totalCount: number
        }
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
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  }
}
