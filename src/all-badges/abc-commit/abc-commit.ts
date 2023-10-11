import { Commit, Repo } from '../../collect/collect.js'
import { BadgePresenter, ID, Present } from '../../badges.js'

export default new (class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = [
    'abcdef-commit',
    'abcde-commit',
    'abcd-commit',
    'abc-commit',
    'ab-commit',
    'a-commit',
  ] as const
  tiers = true as const
  present: Present = (data, grant) => {
    const types: [string, ID][] = [
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
              grant(
                badge,
                `One of my commit sha starts with "${prefix}".`,
              ).evidence(link(re, repo, commit))
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
  }
})()

function link(re: RegExp, repo: Repo, commit: Commit) {
  const sha = commit.sha.replace(re, '<strong>$1</strong>')
  return `- <a href="https://github.com/${repo.owner.login}/${repo.name}/commit/${commit.sha}">${sha}</a>`
}
