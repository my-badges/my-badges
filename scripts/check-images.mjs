#!/usr/bin/env node

import allBadges from '#badges'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import * as path from 'node:path'
import { imageDimensionsFromStream } from 'image-dimensions'

const expectedDimensions = 256

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

let ok = true
const processedBadges = new Set()
for (const { default: b } of allBadges) {
  const dirname = path.basename(path.dirname(fileURLToPath(b.url)))
  for (const id of b.badges) {
    const imagePath = path.join('badges', dirname, `${id}.png`)
    const rootPath = path.join(root, imagePath)
    if (!fs.existsSync(rootPath)) {
      console.error(`Missing image for badge "${id}" at ${rootPath}`)
      ok = false
    }
    const { width, height } = await imageDimensionsFromStream(
      fs.createReadStream(rootPath),
    )
    if (width !== expectedDimensions || height !== expectedDimensions) {
      console.error(
        `Bad image dimensions for badge ${id}.png: ${width}x${height} (expected: ${expectedDimensions}x${expectedDimensions})`,
      )
      ok = false
    }
    if (processedBadges.has(id)) {
      console.error(`Duplicate badge id: ${id} in ${dirname}`)
      ok = false
    }
    processedBadges.add(id)
  }
}
if (!ok) {
  process.exit(1)
} else {
  console.log(
    '✅ All images exist, have the expected dimensions, and have unique ids.',
  )
}
