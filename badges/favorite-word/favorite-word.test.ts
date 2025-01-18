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
})
