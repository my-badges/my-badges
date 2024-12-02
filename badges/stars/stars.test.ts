import { describe, test, expect } from 'vitest'
import starsPresenter from '#badges/stars/stars.js'
import { badgeCollection } from '../../src/present-badges.js'
import { Data } from '../../src/data.js'
import { Badge } from '../../src/badges.js'

describe('stars', () => {
  test('counts and renders as expected', () => {
    const badges: Badge[] = []
    const grant = badgeCollection(badges)
    const data: Data = {
      user: {} as Data['user'],
      pulls: [] as Data['pulls'],
      issues: {} as Data['issues'],
      repos: [
        {
          stargazers: {
            totalCount: 1000,
          },
          name: 'bar',
          owner: {
            login: 'foo',
          },
          commits: [],
        },
        {
          stargazers: {
            totalCount: 2000,
          },
          name: 'qux',
          owner: {
            login: 'foo',
          },
          commits: [] as any[],
        },
      ] as Data['repos'],
    } as Data

    starsPresenter.present(data, grant)

    expect(badges).toEqual([
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
        image: '',
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
        image: '',
      },
      {
        id: 'stars-1000',
        tier: 3,
        desc: 'I collected 1000 stars.',
        body:
          'Repos:\n' +
          '\n' +
          '* <a href="https://github.com/foo/bar">foo/bar: ★1000</a>\n' +
          '\n' +
          "<sup>I have push, maintainer or admin permissions, so I'm definitely an author.<sup>\n",
        image: '',
      },
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
        image: '',
      },
    ])
  })
})
