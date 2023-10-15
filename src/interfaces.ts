import { Badge } from './badges.js'
import { Data } from './providers/gh/collect/collect.js'

export type TBadges = Badge[] & { sha?: string }

export interface TProvider {
  getData(ctx: { user: string; token: string }): Promise<Data>
  getBadges(ctx: {
    user: string
    token: string
    repo?: string
    owner?: string
  }): Promise<TBadges>
  updateBadges(ctx: {
    user: string
    token: string
    badges: TBadges
    repo?: string
    owner?: string
    size: number | string
    readme?: string
    dryrun?: boolean
  }): Promise<void>
}

export type TUpdateMyBadgesNormalizedOpts = {
  token: string
  owner: string
  repo: string
  user: string
  size: string | number
  dryrun: boolean
  compact: boolean
  pickBadges: string[]
  omitBadges: string[]
  dataPath: string
  provider: TProvider
}
