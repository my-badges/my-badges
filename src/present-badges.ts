import { Badge, badgeCollection, BadgePresenter, ID } from './badges.js'
import { allBadges } from './all-badges/index.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Data } from './collect/collect.js'

export const mergeBadges = (...badges: (Badge | Badge[])[]): Badge[] =>
  Object.values(
    badges
      .flat()
      .reduce<Record<string, Badge>>(
        (m, v) => Object.assign(m, { [v.id]: v }),
        {},
      ),
  )

export const presentBadges = (
  data: Data,
  userBadges: Badge[],
  pickBadges: string[],
  omitBadges: string[],
  compact: boolean,
): Badge[] => {
  const presenters: BadgePresenter[] = allBadges.map((m) => m.default)
  for (const presenter of presenters) {
    const newBadges: Badge[] = []
    const grant = badgeCollection(newBadges)
    presenter.present(data, grant)

    // Enhance badges with image URLs.
    for (const b of newBadges) {
      const baseDir = path.basename(path.dirname(fileURLToPath(presenter.url)))
      b.image = `https://github.com/my-badges/my-badges/blob/master/src/all-badges/${baseDir}/${b.id}.png?raw=true`
    }

    userBadges = mergeBadges(userBadges, newBadges)
  }


  if (compact) {
    for (const presenter of presenters) {
      if (!presenter.tiers) {
        continue
      }
      const touchedBadges = userBadges.filter(({ id }) =>
        (presenter.badges as ID[]).includes(id),
      )
      const newHighestTierBadge = touchedBadges.reduce(
        (prev, curr) => (prev.tier > curr.tier ? prev : curr),
        {} as Badge,
      )

      omitBadges.push(
        ...touchedBadges
          .map(({ id }) => id)
          .filter((id) => id !== newHighestTierBadge.id),
      )
    }
  }
  if (pickBadges.length > 0) {
    userBadges = userBadges.filter((x) => pickBadges.includes(x.id))
  }
  if (omitBadges.length > 0) {
    userBadges = userBadges.filter((x) => !omitBadges.includes(x.id))
  }

  return userBadges
}
