// DO NOT EDIT. This is a generated file. Instead of this file, edit "comments.graphql".

const DiscussionComment = `#graphql
fragment DiscussionComment on DiscussionComment {
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
  ...Reactions
}`

export type DiscussionComment = {
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
} & Reactions

const IssueComment = `#graphql
fragment IssueComment on IssueComment {
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
  ...Reactions
}`

export type IssueComment = {
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
} & Reactions

const Reactions = `#graphql
fragment Reactions on Reactable {
  reactions(first: 100) {
    totalCount
    nodes {
      content
      user {
        login
      }
    }
  }
}`

export type Reactions = {
  reactions: {
    totalCount: number
    nodes: Array<{
      content:
        | 'CONFUSED'
        | 'EYES'
        | 'HEART'
        | 'HOORAY'
        | 'LAUGH'
        | 'ROCKET'
        | 'THUMBS_DOWN'
        | 'THUMBS_UP'
      user: {
        login: string
      } | null
    }> | null
  }
}

export const DiscussionCommentsQuery = `#graphql
${Reactions}
${IssueComment}
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
${Reactions}
${IssueComment}
${DiscussionComment}
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
