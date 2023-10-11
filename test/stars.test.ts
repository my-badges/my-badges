import * as assert from 'node:assert'
import { describe, it } from 'node:test'
import starsPresenter from '../src/all-badges/stars/stars.js'
import { Badge, badgeCollection } from '../src/badges.js'
import { Data } from '../src/collect/collect.js'

describe('stars', () => {
  it('counts and renders as expected', () => {
    const badges: Badge[] = []
    const grant = badgeCollection(
      badges,
      starsPresenter,
      true,
    )
    const data: Data = {
      user: {} as Data['user'],
      pulls: {} as Data['pulls'],
      issues: {} as Data['issues'],
      repos: [
        {
          stargazers_count: 1000,
          name: 'bar',
          owner: {
            login: 'foo',
          },
        },
        {
          stargazers_count: 2000,
          name: 'qux',
          owner: {
            login: 'foo',
          },
        },
      ] as Data['repos'],
    }

    starsPresenter.present(data, grant)

    assert.deepEqual(badges, [
      {
        id: 'stars-2000',
        desc: 'I collected 2000 stars.',
        body:
          'Repos:\n' +
          '* <a href="https://github.com/foo/qux     <i>2000</i></a>\n' +
          '* <a href="https://github.com/foo/bar     <i>1000</i></a>\n' +
          '\n' +
          "<sup>I have push, maintainer or admin permissions, so I'm definitely an author.<sup>\n",
        image:
          'https://github.com/my-badges/my-badges/blob/master/src/all-badges/stars/stars-2000.png?raw=true',
      },
      {
        id: 'stars-1000',
        desc: 'I collected 1000 stars.',
        body:
          'Repos:\n' +
          '* <a href="https://github.com/foo/qux     <i>2000</i></a>\n' +
          '* <a href="https://github.com/foo/bar     <i>1000</i></a>\n' +
          '\n' +
          "<sup>I have push, maintainer or admin permissions, so I'm definitely an author.<sup>\n",
        image:
          'https://github.com/my-badges/my-badges/blob/master/src/all-badges/stars/stars-1000.png?raw=true',
      },
      {
        id: 'stars-500',
        desc: 'I collected 500 stars.',
        body:
          'Repos:\n' +
          '* <a href="https://github.com/foo/qux     <i>2000</i></a>\n' +
          '* <a href="https://github.com/foo/bar     <i>1000</i></a>\n' +
          '\n' +
          "<sup>I have push, maintainer or admin permissions, so I'm definitely an author.<sup>\n",
        image:
          'https://github.com/my-badges/my-badges/blob/master/src/all-badges/stars/stars-500.png?raw=true',
      },
      {
        id: 'stars-100',
        desc: 'I collected 100 stars.',
        body:
          'Repos:\n' +
          '* <a href="https://github.com/foo/qux     <i>2000</i></a>\n' +
          '* <a href="https://github.com/foo/bar     <i>1000</i></a>\n' +
          '\n' +
          "<sup>I have push, maintainer or admin permissions, so I'm definitely an author.<sup>\n",
        image:
          'https://github.com/my-badges/my-badges/blob/master/src/all-badges/stars/stars-100.png?raw=true',
      },
    ])
  })
})
