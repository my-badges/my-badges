import {Commit, Repo} from '../../collect/collect.js'
import {BadgePresenter, ID, Present} from '../../badges.js'

export default new class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = [
    'a-commit',
    'ab-commit',
    'abc-commit',
    'abcd-commit',
    'abcde-commit',
    'abcdef-commit',
  ] as const
  present: Present = (data, grant) => {
    const types: [string, ID][] = [
      ['abcdef', 'abcdef-commit'],
      ['abcde', 'abcde-commit'],
      ['abcd', 'abcd-commit'],
      ['abc', 'abc-commit'],
      ['ab', 'ab-commit'],
      ['a', 'a-commit'],
    ]
    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        for (const [prefix, badge] of types) {
          const re = new RegExp(`^(${prefix})`)
          if (re.test(commit.sha)) {
            grant(badge, `One of my commit sha starts with "${prefix}".`)
              .evidence(link(re, repo, commit))
            break
          }
        }
      }
    }
  }
}

function link(re: RegExp, repo: Repo, commit: Commit) {
  const sha = commit.sha.replace(re, '<strong>$1</strong>')
  return `- <a href="https://github.com/${repo.owner.login}/${repo.name}/commit/${commit.sha}">${sha}</a>`
}
