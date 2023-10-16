#!/usr/bin/env node

import minimist from 'minimist'
import { TUpdateMyBadgesOpts, update } from './update-badges.js'

void (async function main() {
  try {
    const { env } = process
    const argv = minimist<TUpdateMyBadgesOpts>(process.argv.slice(2), {
      string: ['data', 'repo', 'token', 'size', 'user', 'pick', 'omit'],
      boolean: ['dryrun', 'dry-run', 'compact', 'shuffle'],
    })

    await update(argv, env)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
