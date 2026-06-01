import { describe, it, expect } from 'vitest'
import { splitWithoutTooFrequentWords } from './favorite-word.js'

describe('favorite-word', () => {
  // prettier-ignore
  describe('ignore conventional commit prefixes', () => {
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
    for (const prefix of prefixes) {
	  describe(`"${prefix}"`, () => {
        it(`ignores "${prefix}" at the beginning of the message`, () => {
          expect(splitWithoutTooFrequentWords(`${prefix}: hello world`)).toEqual(['hello', 'world'])
        })
        it(`ignores "${prefix}" without space after it`, () => {
          expect(splitWithoutTooFrequentWords(`${prefix}:hello world`)).toEqual(['hello', 'world'])
        })
        it(`ignores "${prefix}" with exclamation mark`, () => {
          expect(splitWithoutTooFrequentWords(`${prefix}!: hello world`)).toEqual(['hello', 'world'])
        })
        it(`ignores "${prefix}" with scope`, () => {
          expect(splitWithoutTooFrequentWords(`${prefix}(world): hello`)).toEqual(['hello'])
        })
        it(`don't ignore "${prefix}" if not at the beginning`, () => {
	      const expectedPrefix = `${prefix}:`.toLowerCase().split(' ')
	      expectedPrefix.unshift('hello')
          expect(splitWithoutTooFrequentWords(`hello ${prefix}:`)).toEqual(expectedPrefix)
        })
	  })
    }
    it(`don't ignore fake prefix`, () => {
      expect(splitWithoutTooFrequentWords(`fake: hello world`)).toEqual(['fake:', 'hello', 'world'])
    })
  })

  describe('ignore git trailer lines', () => {
    it('ignores Signed-off-by lines', () => {
      expect(splitWithoutTooFrequentWords('hello world\n\nSigned-off-by: Jane Doe <jane@example.com>')).toEqual(['hello', 'world'])
    })
    it('ignores Co-authored-by lines', () => {
      expect(splitWithoutTooFrequentWords('hello world\n\nCo-authored-by: Jane Doe <jane@example.com>')).toEqual(['hello', 'world'])
    })
    it('does not ignore non-trailer lines', () => {
      expect(splitWithoutTooFrequentWords('hello world\nsome-token: not a trailer')).toEqual(['hello', 'world', 'some-token:', 'not', 'trailer'])
    })
  })

  describe('ignore email addresses', () => {
    it('ignores angle-bracket email tokens', () => {
      expect(splitWithoutTooFrequentWords('hello <jane@example.com> world')).toEqual(['hello', 'world'])
    })
    it('ignores bare email tokens', () => {
      expect(splitWithoutTooFrequentWords('hello jane@example.com world')).toEqual(['hello', 'world'])
    })
  })

  describe('ignore excluded words', () => {
    it('ignores words in the exclude list', () => {
      expect(splitWithoutTooFrequentWords('hello jane world', ['jane'])).toEqual(['hello', 'world'])
    })
    it('exclude list is case-insensitive', () => {
      expect(splitWithoutTooFrequentWords('hello Jane world', ['jane'])).toEqual(['hello', 'world'])
    })
  })
})
