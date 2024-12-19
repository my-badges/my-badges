import { describe, test, expect } from 'vitest'
import { stripMarkdown, quoteAttr } from './utils.js'

describe('utils', () => {
  test('quoteAttr() should escape special characters', async () => {
    const cases = [
      { s: '', want: '' },
      { s: 'abc', want: 'abc' },
      { s: '&\'"<>', want: '&amp;&apos;&quot;&lt;&gt;' },
      { s: '\r\n', want: '&#13;' },
      { s: '\n\n\r\r', want: '&#13;&#13;&#13;&#13;' },
    ]

    cases.forEach(function (c) {
      expect(quoteAttr(c.s)).toBe(c.want)
    })
  })

  test('stripMarkdown() should strip markdown to plain text', async () => {
    const cases = [
      { s: 'hello', want: 'hello' },
      { s: '**hello**', want: '**hello**' },
      { s: '[github](https://github.com)', want: 'github' },
      {
        s: 'hello, [github](https://github.com?token=(*?))!]',
        want: 'hello, github!]',
      },
    ]

    cases.forEach(function (c) {
      expect(stripMarkdown(c.s)).toBe(c.want)
    })
  })
})
