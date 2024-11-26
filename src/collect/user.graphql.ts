// DO NOT EDIT. This is a generated file. Instead of this file, edit "user.graphql".

const User = `#graphql
fragment User on User {
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
}`

export type User = {
  id: string
  login: string
  name: string | null
  avatarUrl: string
  bio: string | null
  company: string | null
  location: string | null
  email: string
  twitterUsername: string | null
  websiteUrl: string | null
  status: {
    createdAt: string
    emoji: string | null
    message: string | null
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
    nodes: Array<
      | ({} & {
          name: string
        } & {
          name: string
        })
      | null
    > | null
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
    }> | null
  }
}

export const UserQuery = `#graphql
${User}
query UserQuery($login: String!) {
  user(login: $login) {
    ...User
  }
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
}` as string & UserQuery

export type UserQuery = (vars: { login: string }) => {
  user: ({} & User) | null
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  } | null
}
