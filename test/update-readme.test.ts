import * as assert from 'node:assert'
import { describe, it } from 'node:test'
import { generateReadme } from '../src/update-readme.js'
import type { Badge } from '../src/badges.js'
import abcPresenter from '../src/all-badges/abc-commit/abc-commit.js'
import { badgeCollection } from '../src/badges.js'

describe('generateReadme()', () => {
  it('injects badges to md contents', () => {
    const readme = `
<!-- my-badges start -->
<!-- my-badges end -->
`
    const badges: Badge[] = []
    const presenter = abcPresenter
    const grant = badgeCollection(badges, presenter, false)

    abcPresenter.badges.forEach((badge) => grant(badge, 'test'))
    assert.equal(badges.length, 6)

    const contents1 = generateReadme(readme, badges, 64)
    assert.equal(
      contents1,
      `
<!-- my-badges start -->
<h4><a href="https://github.com/my-badges/my-badges">My Badges</a></h4>

<a href="my-badges/abcdef-commit.md"><img src="https://github.com/my-badges/my-badges/blob/master/src/all-badges/abc-commit/abcdef-commit.png?raw=true" alt="test" title="test" width="64"></a>
<!-- my-badges end -->

`,
    )
  })

  it('compact', () => {
    const readme = `
<!-- my-badges start -->
<!-- my-badges end -->
`
    const badges: Badge[] = []
    const presenter = abcPresenter
    const grant = badgeCollection(badges, presenter, true)

    abcPresenter.badges.forEach((badge) => grant(badge, 'test'))
    assert.equal(badges.length, 6)

    const contents2 = generateReadme(readme, badges, 64)
    assert.equal(
      contents2,
      `
<!-- my-badges start -->
<h4><a href="https://github.com/my-badges/my-badges">My Badges</a></h4>

<a href="my-badges/a-commit.md"><img src="https://github.com/my-badges/my-badges/blob/master/src/all-badges/abc-commit/a-commit.png?raw=true" alt="test" title="test" width="64"></a>
<a href="my-badges/ab-commit.md"><img src="https://github.com/my-badges/my-badges/blob/master/src/all-badges/abc-commit/ab-commit.png?raw=true" alt="test" title="test" width="64"></a>
<a href="my-badges/abc-commit.md"><img src="https://github.com/my-badges/my-badges/blob/master/src/all-badges/abc-commit/abc-commit.png?raw=true" alt="test" title="test" width="64"></a>
<a href="my-badges/abcd-commit.md"><img src="https://github.com/my-badges/my-badges/blob/master/src/all-badges/abc-commit/abcd-commit.png?raw=true" alt="test" title="test" width="64"></a>
<a href="my-badges/abcde-commit.md"><img src="https://github.com/my-badges/my-badges/blob/master/src/all-badges/abc-commit/abcde-commit.png?raw=true" alt="test" title="test" width="64"></a>
<a href="my-badges/abcdef-commit.md"><img src="https://github.com/my-badges/my-badges/blob/master/src/all-badges/abc-commit/abcdef-commit.png?raw=true" alt="test" title="test" width="64"></a>
<!-- my-badges end -->

`,
    )
  })
})
