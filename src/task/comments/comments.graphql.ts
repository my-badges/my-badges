// DO NOT EDIT. This is a generated file. Instead of this file, edit "comments.graphql".

const DiscussionComment = `#graphql
fragment DiscussionComment on DiscussionComment {
  id
  url
  author {
    login
  }
  discussion {
    number
    repository {
      nameWithOwner
    }
    author {
      login
    }
  }
  body
  createdAt
  updatedAt
  editor {
    login
  }
}`

export type DiscussionComment = {
  id: string
  url: string
  author: {
    login: string
  } | null
  discussion: {
    number: number
    repository: {
      nameWithOwner: string
    }
    author: {
      login: string
    } | null
  } | null
  body: string
  createdAt: string
  updatedAt: string
  editor: {
    login: string
  } | null
}

const IssueComment = `#graphql
fragment IssueComment on IssueComment {
  id
  url
  author {
    login
  }
  repository {
    nameWithOwner
  }
  issue {
    number
    author {
      login
    }
  }
  body
  createdAt
  updatedAt
  editor {
    login
  }
}`

export type IssueComment = {
  id: string
  url: string
  author: {
    login: string
  } | null
  repository: {
    nameWithOwner: string
  }
  issue: {
    number: number
    author: {
      login: string
    } | null
  }
  body: string
  createdAt: string
  updatedAt: string
  editor: {
    login: string
  } | null
}

export const DiscussionCommentsQuery = `#graphql
${DiscussionComment}
query DiscussionCommentsQuery($login: String!, $num: Int = 100, $cursor: String) {
  user(login: $login) {
    repositoryDiscussionComments(first: $num, after: $cursor) {
      totalCount
      nodes {
        ...DiscussionComment
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
}` as string & DiscussionCommentsQuery

export type DiscussionCommentsQuery = (vars: {
  login: string
  num?: number | null
  cursor?: string | null
}) => {
  user: {
    repositoryDiscussionComments: {
      totalCount: number
      nodes: Array<{} & DiscussionComment> | null
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

export const IssueCommentsQuery = `#graphql
${IssueComment}
query IssueCommentsQuery($login: String!, $num: Int = 100, $cursor: String) {
  user(login: $login) {
    issueComments(first: $num, after: $cursor) {
      totalCount
      nodes {
        ...IssueComment
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
}` as string & IssueCommentsQuery

export type IssueCommentsQuery = (vars: {
  login: string
  num?: number | null
  cursor?: string | null
}) => {
  user: {
    issueComments: {
      totalCount: number
      nodes: Array<{} & IssueComment> | null
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
