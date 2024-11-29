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

    for await (const resp of discussionComments) {
      if (!resp.user?.repositoryDiscussionComments.nodes) {
        throw new Error('Failed to load discussion comments')
      }

      for (const comment of resp.user.repositoryDiscussionComments.nodes) {
        data.discussionComments.push(comment)
      }
      console.log(
        `| discussion comments ${data.discussionComments.length}/${resp.user.repositoryDiscussionComments.totalCount} (cost: ${resp.rateLimit?.cost}, remaining: ${resp.rateLimit?.remaining})`,
      )
    }
  },
})
