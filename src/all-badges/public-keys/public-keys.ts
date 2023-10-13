import { BadgePresenter, Present } from '../../badges.js'

export default new (class implements BadgePresenter {
  url = new URL(import.meta.url)
  tiers = true
  badges = [
    'public-keys-1',
    'public-keys-2',
    'public-keys-3',
    'public-keys-4',
    'public-keys-5',
  ] as const
  present: Present = (data, grant) => {
    if (data.user.publicKeys.totalCount == 1) {
      grant('public-keys-1', 'I have one public key').tier(1)
    }
    if (data.user.publicKeys.totalCount == 2) {
      grant('public-keys-2', 'I have two public keys').tier(2)
    }
    if (data.user.publicKeys.totalCount == 3) {
      grant('public-keys-3', 'I have three public keys').tier(3)
    }
    if (data.user.publicKeys.totalCount == 4) {
      grant('public-keys-4', 'I have four public keys').tier(4)
    }
    if (data.user.publicKeys.totalCount >= 5) {
      grant('public-keys-5', 'I have five or more public keys').tier(5)
    }
  }
})()
