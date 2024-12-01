import { task } from '../../task.js'
import { paginate } from '../../utils.js'
import {
  DiscussionCommentsQuery,
  IssueCommentsQuery,
} from './comments.graphql.js'

export default task({
  name: 'discussion-comments' as const,
  run: async ({ octokit, data, next }, { username }: { username: string }) => {
    const discussionComments = paginate(octokit, DiscussionCommentsQuery, {
      login: username,
    })

    data.discussionComments = []

    let reactionsBatch: string[] = []

    for await (const resp of discussionComments) {
      if (!resp.user?.repositoryDiscussionComments.nodes) {
        throw new Error('Failed to load discussion comments')
      }

      for (const comment of resp.user.repositoryDiscussionComments.nodes) {
        data.discussionComments.push(comment)
        if (comment.reactionsTotal.totalCount > 0) {
          if (reactionsBatch.length > 100) {
            next('reactions-discussion-comments', {
              id: comment.id,
            })
          } else {
            reactionsBatch.push(comment.id)
            if (reactionsBatch.length === 50) {
              next('reactions-batch', {
                ids: reactionsBatch,
              })
              reactionsBatch = []
            }
          }
        }
      }
      console.log(
        `| discussion comments ${data.discussionComments.length}/${resp.user.repositoryDiscussionComments.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
    }

    if (reactionsBatch.length > 0) {
      next('reactions-batch', {
        ids: reactionsBatch,
      })
    }
  },
})
