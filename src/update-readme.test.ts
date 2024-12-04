import { describe, test, expect } from 'vitest'
import { generateReadme } from './update-readme.js'
import type { Badge } from './badges.js'
import abcPresenter from '#badges/abc-commit/abc-commit.js'
import { badgeCollection } from './present-badges.js'

describe('generateReadme()', () => {
  test('injects badges to md contents', () => {
    const readme = `
<!-- my-badges start -->
<!-- my-badges end -->
# readme`
    const badges: Badge[] = []
    const grant = badgeCollection(badges)

    abcPresenter.badges.forEach((badge) => grant(badge, 'test'))
    expect(badges.length).toEqual(6)

    const contents = generateReadme(readme, badges, 64)
    expect(contents).toEqual(
      `
<!-- my-badges start -->
<a href="my-badges/a-commit.md"><img src="" alt="test" title="test" width="64"></a>
<a href="my-badges/ab-commit.md"><img src="" alt="test" title="test" width="64"></a>
<a href="my-badges/abc-commit.md"><img src="" alt="test" title="test" width="64"></a>
<a href="my-badges/abcd-commit.md"><img src="" alt="test" title="test" width="64"></a>
<a href="my-badges/abcde-commit.md"><img src="" alt="test" title="test" width="64"></a>
<a href="my-badges/abcdef-commit.md"><img src="" alt="test" title="test" width="64"></a>
<!-- my-badges end -->
# readme`,
    )
  })

  test('prepends badges if no marks found', () => {
    const readme = '# Readme'
    const badges: Badge[] = []
    const grant = badgeCollection(badges)

    abcPresenter.badges.forEach((badge) => grant(badge, 'test'))
    expect(badges.length).toEqual(6)

    const contents = generateReadme(readme, badges, 64)

    expect(contents).toEqual(
      `<!-- my-badges start -->
<a href="my-badges/a-commit.md"><img src="" alt="test" title="test" width="64"></a>
<a href="my-badges/ab-commit.md"><img src="" alt="test" title="test" width="64"></a>
<a href="my-badges/abc-commit.md"><img src="" alt="test" title="test" width="64"></a>
<a href="my-badges/abcd-commit.md"><img src="" alt="test" title="test" width="64"></a>
<a href="my-badges/abcde-commit.md"><img src="" alt="test" title="test" width="64"></a>
<a href="my-badges/abcdef-commit.md"><img src="" alt="test" title="test" width="64"></a>
<!-- my-badges end -->

${readme}`,
    )
  })
})
