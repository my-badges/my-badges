import { describe, it, expect } from 'vitest'
import { makeBadgeBody, countBadgeType } from './conventional-commit.js'

describe('conventional-commit', () => {
  // prettier-ignore
  const prefixes = [
    'BREAKING CHANGE',
    'build',
    'chore',
    'ci',
    'docs',
    'feat',
    'fix',
    'perf',
    'refactor',
    'revert',
    'style',
    'test',
  ]

  prefixes.forEach((prefix) => {
    describe(`count the number of "${prefix}" prefixes`, () => {
      it(`should have a count of 1`, () => {
        expect(
          countBadgeType(['Hello World', `${prefix}: Hello World`]),
        ).toStrictEqual([[prefix, 1]])
      })
      it(`should have a count of 3`, () => {
        expect(
          countBadgeType([
            'Hello World',
            `${prefix}: Hello World`,
            'Hello World',
            `${prefix}: Hello World`,
            `${prefix}: Hello World`,
          ]),
        ).toStrictEqual([[prefix, 3]])
      })
    })
  })

  it('Should work with multiple types of commits', () => {
    expect(
      countBadgeType([
        'Hello World',
        'feat: Hello World',
        'fix: Hello World',
        'BREAKING CHANGE: Hello World',
        'fix: Hello World',
      ]),
    ).toStrictEqual([
      ['feat', 1],
      ['fix', 2],
      ['BREAKING CHANGE', 1],
    ])
  })

  it('Should count "!" as a breaking change', () => {
    expect(
      countBadgeType([
        'feat!: Hello World',
        'feat: Hello World',
        'fix: Hello World',
        'BREAKING CHANGE!: Hello World',
        'BREAKING CHANGE: Hello World',
      ]),
    ).toStrictEqual([
      ['feat', 2],
      ['BREAKING CHANGE', 3],
      ['fix', 1],
    ])
  })

  it('Shouldn’t differentiate "breaking changes" and "breaking change"', () => {
	expect(
	  countBadgeType([
		'BREAKING CHANGE: Hello World',
		'BREAKING CHANGES: Hello World',
	  ]),
	).toStrictEqual([
	  ['BREAKING CHANGE', 2],
	])
  });

  describe("check that the badge's message looks nice", () => {
    it('"BREAKING CHANGE" should become "breaking change"', () => {
      expect(makeBadgeBody([['BREAKING CHANGE', 1]])).toBe(
        "I've done 1 breaking change commit",
      )
    })
    it('"build" should stay "build"', () => {
      expect(makeBadgeBody([['build', 1]])).toBe("I've done 1 build commit")
    })
    it('"chore" should stay "chore"', () => {
      expect(makeBadgeBody([['chore', 1]])).toBe("I've done 1 chore commit")
    })
    it('"ci" should become "continuous integration"', () => {
      expect(makeBadgeBody([['ci', 1]])).toBe(
        "I've done 1 continuous integration commit",
      )
    })
    it('"docs" should become "documentation"', () => {
      expect(makeBadgeBody([['docs', 1]])).toBe(
        "I've done 1 documentation commit",
      )
    })
    it('"feat" should become "feature"', () => {
      expect(makeBadgeBody([['feat', 1]])).toBe("I've done 1 feature commit")
    })
    it('"fix" should stay "fix"', () => {
      expect(makeBadgeBody([['fix', 1]])).toBe("I've done 1 fix commit")
    })
    it('"perf" should become "performance"', () => {
      expect(makeBadgeBody([['perf', 1]])).toBe(
        "I've done 1 performance commit",
      )
    })
    it('"refactor" should become "refactoring"', () => {
      expect(makeBadgeBody([['refactor', 1]])).toBe(
        "I've done 1 refactoring commit",
      )
    })
    it('"revert" should become "revertion"', () => {
      expect(makeBadgeBody([['revert', 1]])).toBe(
        "I've done 1 revertion commit",
      )
    })
    it('"style" should become "esthetics"', () => {
      expect(makeBadgeBody([['style', 1]])).toBe("I've done 1 esthetics commit")
    })
    it('"test" should stay "test"', () => {
      expect(makeBadgeBody([['test', 1]])).toBe("I've done 1 test commit")
    })
  })

  it('Should only show the 6 most common types of commits', () => {
    expect(
      makeBadgeBody([
        ['ci', 2],
        ['feat', 4],
        ['fix', 3],
        ['BREAKING CHANGE', 1],
        ['style', 1],
        ['chore', 1],
        ['test', 2],
        ['docs', 2],
        ['refactor', 2],
      ]),
    ).toBe(
      [
        "I've done 4 feature commit",
        "I've done 3 fix commit",
        "I've done 2 continuous integration commit",
        "I've done 2 test commit",
        "I've done 2 documentation commit",
        "I've done 2 refactoring commit",
      ].join('\n'),
    )
  })
})
