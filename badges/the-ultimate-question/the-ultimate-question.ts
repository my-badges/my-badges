import { define, Issue, PullRequest } from '#src'

export default define({
  url: import.meta.url,
  badges: ['the-ultimate-question'] as const,
  present(data, grant) {
    const list: (Issue | PullRequest)[] = []

    for (const issue of data.issues) {
      if (issue.number == 42) list.push(issue)
    }
    for (const pull of data.pulls) {
      if (pull.number == 42) list.push(pull)
    }

    if (list.length > 0) {
      grant(
        'the-ultimate-question',
        'I found the answer to the ultimate question of life, the universe, and everything!',
      ).evidence(list.map((x) => `- ${link(x)}`).join('\n'))
    }
  },
})

function link(x: Issue | PullRequest): string {
  return `<a href="https://github.com/${x.repository.owner.login}/${x.repository.name}/issues/${x.number}">#${x.number}</a>`
}
