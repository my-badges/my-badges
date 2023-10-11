import * as assert from 'node:assert'
import { describe, it } from 'node:test'
import { allBadges, names } from '../src/all-badges/index.js'
import { Badge, badgeCollection } from '../src/badges.js'
import abcPresenter from '../src/all-badges/abc-commit/abc-commit.js'

describe('badges', () => {
  it('exposes all badges presenters', () => {
    const expected = [
      'a-commit',
      'ab-commit',
      'abc-commit',
      'abcd-commit',
      'abcde-commit',
      'abcdef-commit',
      'stars-100',
      'stars-500',
      'stars-1000',
      'stars-2000',
      'stars-5000',
      'stars-10000',
      'stars-20000',
      'midnight-commits',
      'morning-commits',
      'evening-commits',
      'yeti',
      'star-gazer',
      'dead-commit',
      'bad-words',
      'mass-delete-commit',
      'mass-delete-commit-10k',
      'revert-revert-commit',
      'my-badges-contributor',
      'fix-2',
      'fix-3',
      'fix-4',
      'fix-5',
      'fix-6',
      'fix-6+',
      'chore-commit',
      'delorean',
    ]

    assert.deepEqual(names.sort(), expected.sort())
  })

  it('grant respects pick and omit params', () => {
    const badges: Badge[] = []
    const presenter = abcPresenter
    const pickBadges = ['a-commit', 'ab-commit', 'abc-commit', 'abcd-commit']
    const omitBadges = ['ab-commit', 'abc-commit']
    const grant = badgeCollection(badges, presenter.url, pickBadges, omitBadges)

    abcPresenter.badges.forEach((badge) => grant(badge, 'test'))

    assert.deepEqual(badges, [
      {
        id: 'a-commit',
        desc: 'test',
        body: '',
        image:
          'https://github.com/my-badges/my-badges/blob/master/src/all-badges/abc-commit/a-commit.png?raw=true',
      },
      {
        id: 'abcd-commit',
        desc: 'test',
        body: '',
        image:
          'https://github.com/my-badges/my-badges/blob/master/src/all-badges/abc-commit/abcd-commit.png?raw=true',
      },
    ])
  })
})
