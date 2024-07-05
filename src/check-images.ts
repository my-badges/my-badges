import allBadges from '#badges'
import fs from 'node:fs'
import { fileURLToPath } from 'url'
import * as path from 'path'

void (async function main() {
  const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..')

  let foundMissing = false
  for (const { default: b } of allBadges) {
    const dirname = path.basename(path.dirname(fileURLToPath(b.url)))
    for (const id of b.badges) {
      const imagePath = path.join('badges', dirname, `${id}.png`)
      const rootPath = path.join(root, imagePath)
      if (!fs.existsSync(rootPath)) {
        console.error(`Missing image for badge "${id}" at ${rootPath}`)
        foundMissing = true
      } else {
        console.log(`<img src="${imagePath}" alt="${id}" width="42">`)
      }
    }
  }
  if (foundMissing) {
    process.exit(1)
    return
  }
})()
