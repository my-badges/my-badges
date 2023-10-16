import { Badge, badgeCollection, BadgePresenter, ID } from './badges.js'
import { allBadges } from './all-badges/index.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Data } from './collect/collect.js'
import { parseMask } from './utils.js'

export const presentBadges = (
  presenters: BadgePresenter[],
  data: Data,
  userBadges: Badge[],
  pickBadges: string[],
  omitBadges: string[],
  compact: boolean,
): Badge[] => {
  for (const presenter of presenters) {
    const newBadges: Badge[] = []
    const grant = badgeCollection(newBadges)
    presenter.present(data, grant)

    if (newBadges.length === 0) {
      continue
    }

    // Enhance badges with image URLs.
    for (const b of newBadges) {
      const baseDir = path.basename(path.dirname(fileURLToPath(presenter.url)))
      b.image = `https://github.com/my-badges/my-badges/blob/master/src/all-badges/${baseDir}/${b.id}.png?raw=true`
    }

    const badgeFromPresenter = (x: Badge) =>
      (presenter.badges as ID[]).includes(x.id)

    // Merge existing userBadges with newBadges.
    if (compact && presenter.tiers) {
      const newHighestTierBadge = newBadges.reduce((prev, curr) => {
        return prev.tier > curr.tier ? prev : curr
      })

      const existingBadgeIndex = userBadges.findIndex(badgeFromPresenter)
      if (existingBadgeIndex === -1) {
        userBadges.push(newHighestTierBadge)
      } else if (
        newHighestTierBadge.tier >= userBadges[existingBadgeIndex].tier
      ) {
        userBadges[existingBadgeIndex] = newHighestTierBadge

        // Drop all other badges from the same presenter.
        userBadges = userBadges.filter(
          (x, i) => i === existingBadgeIndex || !badgeFromPresenter(x),
        )
      }
    } else {
      for (const badge of newBadges) {
        const index = userBadges.findIndex((x) => x.id === badge.id)
        if (index === -1) {
          userBadges.push(badge)
        } else {
          userBadges[index] = badge
        }
      }
    }
  }

  if (pickBadges.length > 0) {
    userBadges = userBadges.filter((x) =>
      pickBadges.map(parseMask).some((r) => r.test(x.id)),
    )
  }

  if (omitBadges.length > 0) {
    userBadges = userBadges.filter((x) =>
      omitBadges.map(parseMask).every((r) => !r.test(x.id)),
    )
  }

  return userBadges
}
