import { collect, Data } from './collect/collect.js'
import fs from 'node:fs'
import { Badge } from './badges.js'
import { Octokit, RequestError } from 'octokit'
import { decodeBase64 } from './utils.js'
import { MY_BADGES_JSON_PATH } from './constants.js'

export async function getData(
  octokit: Octokit,
  dataPath: string,
  username: string,
): Promise<Data> {
  if (dataPath !== '') {
    if (!fs.existsSync(dataPath)) {
      throw new Error('Data file not found')
    }
    return JSON.parse(fs.readFileSync(dataPath, 'utf8')) as Data
  }

  if (!username) {
    throw new Error('Specify username')
  }

  const data = await collect(octokit, username)
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data')
  }
  fs.writeFileSync(`data/${username}.json`, JSON.stringify(data, null, 2))

  return data
}
