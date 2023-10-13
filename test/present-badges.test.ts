import * as assert from 'node:assert'
import { describe, it } from 'node:test'
import { Data } from '../src/collect/collect.js'
import { presentBadges } from '../src/present-badges.js'

describe('present-badges', () => {
  const data: Data = {
    user: {
      publicKeys: {
        totalCount: 1,
      },
    } as Data['user'],
    pulls: [] as Data['pulls'],
    issues: {} as Data['issues'],
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

  it('presentBadges() applies `pick`', () => {
    const userBadges = presentBadges(
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
          'https://github.com/my-badges/my-badges/blob/master/src/all-badges/stars/stars-100.png?raw=true',
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
          'https://github.com/my-badges/my-badges/blob/master/src/all-badges/stars/stars-500.png?raw=true',
      },
    ])
  })

  it('presentBadges() applies `omit`', () => {
    const userBadges = presentBadges(
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
          'https://github.com/my-badges/my-badges/blob/master/src/all-badges/stars/stars-100.png?raw=true',
      },
    ])
  })

  it('presentBadges() supports masks for `omit` && `pick`', () => {
    const userBadges = presentBadges(
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
          'https://github.com/my-badges/my-badges/blob/master/src/all-badges/stars/stars-100.png?raw=true',
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
          'https://github.com/my-badges/my-badges/blob/master/src/all-badges/stars/stars-500.png?raw=true',
      },
    ])
  })

  it('presentBadges() applies `compact`', () => {
    const userBadges = presentBadges(
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
          'https://github.com/my-badges/my-badges/blob/master/src/all-badges/stars/stars-2000.png?raw=true',
      },
    ])
  })
})
