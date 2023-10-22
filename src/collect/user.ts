export const userQuery = `#graphql
query UserQuery($login: String!) {
  user(login: $login) {
    id
    login
    name
    avatarUrl
    bio
    company
    location
    email
    twitterUsername
    websiteUrl
    status {
      createdAt
      emoji
      message
    }
    createdAt
    followers {
      totalCount
    }
    following {
      totalCount
    }
    anyPinnableItems
    pinnedItems(first: 6) {
      totalCount
      nodes {
        ... on Gist {
          name
        }
        ... on Repository {
          name
        }
      }
    }
    sponsoring {
      totalCount
    }
    sponsors {
      totalCount
    }
    starredRepositories {
      totalCount
    }
    publicKeys(first: 5) {
      totalCount
      nodes {
        key
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
    starredRepositories: {
      totalCount: number
    }
    publicKeys: {
      totalCount: number
      nodes: Array<{
        key: string
      }>
    }
  }
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  }
}
