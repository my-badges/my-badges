import { Badge, Evidence, ID, List, Presenter } from './badges.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseMask } from './utils.js'
import { Data } from './collect/index.js'

export const presentBadges = <P extends Presenter<List>>(
  presenters: P[],
  data: Data,
  userBadges: Badge[],
  pickBadges: string[],
  omitBadges: string[],
  compact: boolean,
): Badge[] => {
  for (const presenter of presenters) {
    const newBadges: Badge[] = []
    const grant = badgeCollection(newBadges)

    // @ts-ignore As `id: string` is not assignable to `id: ID`.
    presenter.present(data, grant)

    if (newBadges.length === 0) {
      continue
    }

    // Enhance badges with image URLs.
    for (const b of newBadges) {
      b.image = `https://my-badges.github.io/my-badges/${b.id}.png`
    }

    const badgeFromPresenter = (x: Badge) => presenter.badges.includes(x.id)

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

export function badgeCollection(newBadges: Badge[]) {
  return function grant(id: ID, desc: string) {
    const badge: Badge = {
      id,
      tier: 0,
      desc,
      body: '',
      image: '',
    }
    if (!newBadges.some((x) => x.id === id)) {
      newBadges.push(badge)
    }
    return new Evidence(badge)
  }
}
