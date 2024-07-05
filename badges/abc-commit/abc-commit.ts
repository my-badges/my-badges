import { Commit, define, Repo } from '#src'

export default define({
  url: import.meta.url,
  tiers: true,
  badges: [
    'a-commit',
    'ab-commit',
    'abc-commit',
    'abcd-commit',
    'abcde-commit',
    'abcdef-commit',
  ] as const,
  present(data, grant) {
    const types: [string, (typeof this.badges)[number]][] = [
      ['abcdef', 'abcdef-commit'],
      ['abcde', 'abcde-commit'],
      ['abcd', 'abcd-commit'],
      ['abc', 'abc-commit'],
      ['ab', 'ab-commit'],
      ['a', 'a-commit'],
    ]
    const order: (Function | undefined)[] = Array.from(Array(10))

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        for (const [prefix, badge] of types) {
          const re = new RegExp(`^(${prefix})`)
          if (re.test(commit.sha)) {
            order[prefix.length] = () =>
              grant(badge, `One of my commit sha starts with "${prefix}".`)
                .evidence(link(re, repo, commit))
                .tier(prefix.length)
            break
          }
        }
      }
    }

    for (const fn of order) {
      if (fn) {
        fn()
      }
    }
  },
})

function link(re: RegExp, repo: Repo, commit: Commit) {
  const sha = commit.sha.replace(re, '<strong>$1</strong>')
  return `- <a href="https://github.com/${repo.owner.login}/${repo.name}/commit/${commit.sha}">${sha}</a>`
}
