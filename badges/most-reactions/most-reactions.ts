import { define, plural } from '#src'

export default define({
  url: import.meta.url,
  badges: ['most-reactions'] as const,
  present(data, grant) {
    const reactions: Record<string, { count: number; repository: string }> = {}

    for (const issue of data.issues) {
      if (issue.reactions.totalCount > 0) {
        reactions[issue.url] = {
          count: issue.reactions.totalCount,
          repository: issue.repository.nameWithOwner,
        }
      }
    }

    for (const pull of data.pulls) {
      if (pull.reactions.totalCount > 0) {
        reactions[pull.url] = {
          count: pull.reactions.totalCount,
          repository: pull.repository.nameWithOwner,
        }
      }
    }

    for (const comment of data.issueComments) {
      if (comment.reactions.totalCount > 0) {
        reactions[comment.repository.nameWithOwner] = {
          count: comment.reactions.totalCount,
          repository: comment.repository.nameWithOwner,
        }
      }
    }

    for (const discussion of data.discussionComments) {
      if (discussion.reactions.totalCount > 0 && discussion.discussion) {
        reactions[discussion.discussion.repository.nameWithOwner] = {
          count: discussion.reactions.totalCount,
          repository: discussion.discussion?.repository.nameWithOwner,
        }
      }
    }

    const pairs = Object.entries(reactions)
    pairs.sort((a, b) => b[1].count - a[1].count)
    if (pairs.length === 0) return

    const topReactions = pairs.slice(0, 10)
    // grant(
    //   'most-reactions',
    //   `I have received the most reactions on issues!\n\n` +
    //     topReactions
    //       .map((p) => `- ${p[1].repository}: ${p[1].count} reactions`)
    //       .join('\n'),
    // )
  },
})
