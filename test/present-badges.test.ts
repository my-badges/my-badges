import * as assert from 'node:assert'
import { describe, it } from 'node:test'
import { presentBadges } from '../src/present-badges.js'
import { Badge, define, List, Presenter } from '../src/badges.js'
import { Data } from '../src/collect/types.js'

describe('present-badges', () => {
  const data: Data = {
    user: {
      publicKeys: {
        totalCount: 1,
      },
    } as Data['user'],
    pulls: [] as Data['pulls'],
    issues: [] as Data['issues'],
    repos: [
      {
        stargazers_count: 1000,
        name: 'bar',
        owner: {
          login: 'foo',
        },
        commits: [],
      },
      {
        stargazers_count: 2000,
        name: 'qux',
        owner: {
          login: 'foo',
        },
        commits: [] as any[],
      },
    ] as Data['repos'],
  }

  it('presentBadges() applies `pick`', async () => {
    const userBadges = presentBadges(
      [await import('#badges/stars/stars.js')].map((m) => m.default),
      data,
      [],
      ['stars-100', 'stars-500'],
      [],
      false,
    )

    assert.deepEqual(userBadges, [
      {
        id: 'stars-100',
        tier: 1,
        desc: 'I collected 100 stars.',
        body:
          'Repos:\n' +
          '\n' +
          '* <a href="https://github.com/foo/bar">foo/bar: ★1000</a>\n' +
          '\n' +
          "<sup>I have push, maintainer or admin permissions, so I'm definitely an author.<sup>\n",
        image:
          'https://github.com/my-badges/my-badges/blob/master/badges/stars/stars-100.png?raw=true',
      },
      {
        id: 'stars-500',
        tier: 2,
        desc: 'I collected 500 stars.',
        body:
          'Repos:\n' +
          '\n' +
          '* <a href="https://github.com/foo/bar">foo/bar: ★1000</a>\n' +
          '\n' +
          "<sup>I have push, maintainer or admin permissions, so I'm definitely an author.<sup>\n",
        image:
          'https://github.com/my-badges/my-badges/blob/master/badges/stars/stars-500.png?raw=true',
      },
    ])
  })

  it('presentBadges() applies `omit`', async () => {
    const userBadges = presentBadges(
      [await import('#badges/stars/stars.js')].map((m) => m.default),
      data,
      [],
      ['stars-100', 'stars-500'],
      ['stars-500'],
      false,
    )

    assert.deepEqual(userBadges, [
      {
        id: 'stars-100',
        tier: 1,
        desc: 'I collected 100 stars.',
        body:
          'Repos:\n' +
          '\n' +
          '* <a href="https://github.com/foo/bar">foo/bar: ★1000</a>\n' +
          '\n' +
          "<sup>I have push, maintainer or admin permissions, so I'm definitely an author.<sup>\n",
        image:
          'https://github.com/my-badges/my-badges/blob/master/badges/stars/stars-100.png?raw=true',
      },
    ])
  })

  it('presentBadges() supports masks for `omit` && `pick`', async () => {
    const userBadges = presentBadges(
      [await import('#badges/stars/stars.js')].map((m) => m.default),
      data,
      [],
      ['stars-*'],
      ['stars-*000'],
      false,
    )

    assert.deepEqual(userBadges, [
      {
        id: 'stars-100',
        tier: 1,
        desc: 'I collected 100 stars.',
        body:
          'Repos:\n' +
          '\n' +
          '* <a href="https://github.com/foo/bar">foo/bar: ★1000</a>\n' +
          '\n' +
          "<sup>I have push, maintainer or admin permissions, so I'm definitely an author.<sup>\n",
        image:
          'https://github.com/my-badges/my-badges/blob/master/badges/stars/stars-100.png?raw=true',
      },
      {
        id: 'stars-500',
        tier: 2,
        desc: 'I collected 500 stars.',
        body:
          'Repos:\n' +
          '\n' +
          '* <a href="https://github.com/foo/bar">foo/bar: ★1000</a>\n' +
          '\n' +
          "<sup>I have push, maintainer or admin permissions, so I'm definitely an author.<sup>\n",
        image:
          'https://github.com/my-badges/my-badges/blob/master/badges/stars/stars-500.png?raw=true',
      },
    ])
  })

  it('presentBadges() applies `compact`', async () => {
    const userBadges = presentBadges(
      [await import('#badges/stars/stars.js')].map((m) => m.default),
      data,
      [],
      ['stars-1000', 'stars-2000', 'stars-5000'],
      [],
      true,
    )

    assert.deepEqual(userBadges, [
      {
        id: 'stars-2000',
        tier: 4,
        desc: 'I collected 2000 stars.',
        body:
          'Repos:\n' +
          '\n' +
          '* <a href="https://github.com/foo/qux">foo/qux: ★2000</a>\n' +
          '* <a href="https://github.com/foo/bar">foo/bar: ★1000</a>\n' +
          '\n' +
          "<sup>I have push, maintainer or admin permissions, so I'm definitely an author.<sup>\n",
        image:
          'https://github.com/my-badges/my-badges/blob/master/badges/stars/stars-2000.png?raw=true',
      },
    ])
  })

  it('presentBadges() keeps existing order of badges', async () => {
    const dumpPresenter1 = define({
      url: 'file:///tmp/dump.js',
      badges: ['a-commit', 'ab-commit', 'abc-commit'] as const,
      present: (_, grant) => {
        grant('a-commit', 'a')
        grant('ab-commit', 'ab')
        grant('abc-commit', 'abc')
      },
    })
    const dumpPresenter2 = define({
      url: 'file:///tmp/dump.js',
      badges: ['this-is-fine'] as const,
      present: (_, grant) => {
        grant('this-is-fine', 'this is fine')
      },
    })

    const oldUserBadges: Badge[] = [
      {
        id: 'a-commit',
        tier: 0,
        desc: 'a',
        body: '',
        image: '',
      },
      {
        id: 'abc-commit',
        tier: 0,
        desc: 'abc',
        body: '',
        image: '',
      },
      {
        id: 'this-is-fine',
        tier: 0,
        desc: 'this is fine',
        body: '',
        image: '',
      },
    ]

    const userBadges = presentBadges(
      [dumpPresenter1, dumpPresenter2],
      data,
      oldUserBadges,
      [],
      [],
      false,
    )
    assert.deepEqual(
      userBadges.map((x) => x.id),
      ['a-commit', 'abc-commit', 'this-is-fine', 'ab-commit'],
    )
  })
})
