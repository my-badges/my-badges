import { BadgePresenter, Present } from '../../badges.js'
import { Pull } from '../../collect/types.js'

export default new (class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = ['my-badges-contributor'] as const
  present: Present = (data, grant) => {
    const pulls: Pull[] = []
    for (const pull of data.pulls) {
      if (
        pull.repository.name === 'my-badges' &&
        pull.repository.owner.login === 'my-badges' &&
        pull.merged
      ) {
        pulls.push(pull)
      }
    }

    if (pulls.length > 0) {
      grant(
        'my-badges-contributor',
        'I contributed to <https://github.com/my-badges/my-badges>!',
      ).evidencePRs(...pulls)
    }
  }
})()
