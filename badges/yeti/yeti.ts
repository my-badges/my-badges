import { define } from '#src'

export default define({
  url: import.meta.url,
  badges: ['yeti'] as const,
  present(data, grant) {
    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        if (/yeti/i.test(commit.message)) {
          grant('yeti', 'I found the yeti!').evidenceCommits(commit)
          return
        }
      }
    }
  },
})
