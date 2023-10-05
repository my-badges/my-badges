import {allBadges} from './all-badges/index.js'
import fs from 'node:fs'
import {fileURLToPath} from 'url'
import * as path from 'path'

void async function main() {
  const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

  let foundMissing = false
  for (const {default: b} of allBadges) {
    const dirname = path.basename(path.dirname(fileURLToPath(b.url)))
    for (const id of b.badges) {
      const image = path.join(root, 'src/all-badges', dirname, `${id}.png`)
      if (!fs.existsSync(image)) {
        console.error(`Missing image for badge "${id}" at ${image}`)
        foundMissing = true
      } else {
        console.log(`<img src="${image}" alt="${id}" width="100" height="100">`)
      }
    }
  }
  if (foundMissing) {
    process.exit(1)
  }
}()
