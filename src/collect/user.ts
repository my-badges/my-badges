export type UserQuery = {
  user: {
    id: string
    login: string
    name: string
    avatarUrl: string
    bio: string | null
    company: string | null
    location: string | null
    email: string
    twitterUsername: string | null
    websiteUrl: string | null
    status: {
      createdAt: string
      emoji: string
      message: string
    } | null
    createdAt: string
    followers: {
      totalCount: number
    }
    following: {
      totalCount: number
    }
    anyPinnableItems: boolean
    pinnedItems: {
      totalCount: number
      nodes: Array<{
        name: string
      }>
    }
    sponsoring: {
      totalCount: number
    }
    sponsors: {
      totalCount: number
    }
  }
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  }
}
