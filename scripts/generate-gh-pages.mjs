#!/usr/bin/env node

import allBadges from '#badges'
import { fileURLToPath } from 'node:url'
import * as path from 'node:path'
import fs from 'node:fs'

const badgesHtml = []

for (const { default: b } of allBadges) {
  const url = fileURLToPath(b.url)
  const dirname = path.basename(path.dirname(url))
  const filename = path.basename(url).replace('.js', '.ts')
  for (const id of b.badges) {
    badgesHtml.push(
      `<a href="https://github.com/my-badges/my-badges/tree/master/badges/${dirname}/${filename}"><img src="https://my-badges.github.io/my-badges/${id}.png" alt="${b.desc}" title="${b.desc}" width="128"></a>`,
    )
  }
}

const html = `
<!doctype html>
<html lang="en">
  <head>
    <title>My Badges</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet">
    <style>
      body {
        background-color: #f6f8fa;
        font-family: "Anton", sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: 16px;
        margin: 0;
        padding: 40px;
      }
      h1 {
        font-size: 5rem;
        margin: 2.5rem 0 3rem;
        text-align: center;
        color: #0366d6;
      }
      main {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
      a {
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <h1>My Badges</h1>
    <main>
      ${badgesHtml.join('\n')}
    </main>
  </body>
</html>
`

fs.mkdirSync('.pages', { recursive: true })
fs.writeFileSync('.pages/index.html', html)
