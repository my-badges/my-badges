import {BadgePresenter, Present} from '../../badges.js'

export default new class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = [
    'star-gazer',
  ] as const
  present: Present = (data, grant) => {
    if (data.user.starredRepositories.totalCount >= 1000) {
      grant('star-gazer', 'I\'m a star gazer!')
        .evidence('I\'ve starred over 1000 repositories!')
    }
  }
}
