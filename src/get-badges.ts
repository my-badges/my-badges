import { collect, Data } from './collect/collect.js'
import fs from 'node:fs'
import { Badge } from './badges.js'
import { Octokit, RequestError } from 'octokit'
import { decodeBase64 } from './utils.js'
import { MY_BADGES_JSON_PATH } from './constants.js'

export const getData = async (
  octokit: Octokit,
  dataPath: string,
  username: string,
): Promise<Data> => {
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

export const getOldData = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  myBadges?: any, // test snapshot
) => {
  console.log('Loading my-badges.json')
  try {
    const { data } =
      myBadges ||
      (await octokit.request<'content-file'>(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          owner,
          repo,
          path: MY_BADGES_JSON_PATH,
        },
      ))
    const oldJson = decodeBase64(data.content)
    const jsonSha = data.sha
    const userBadges = JSON.parse(oldJson)

    // Add missing tier property in old my-badges.json.
    for (const b of userBadges) {
      if (b.tier === undefined) b.tier = 0
    }

    return {
      userBadges,
      jsonSha,
      oldJson,
    }
  } catch (err) {
    console.log(err)
    if (err instanceof RequestError && err.response?.status != 404) {
      throw err
    }
  }

  return {}
}

export const getBadges = async (
  octokit: Octokit,
  dataPath: string,
  username: string,
  owner: string,
  repo: string,
): Promise<{
  data: Data
  userBadges: Badge[]
  oldJson?: string
  jsonSha?: string
}> => {
  const data = await getData(octokit, dataPath, username)
  const {
    oldJson = undefined,
    jsonSha = undefined,
    userBadges = [],
  } = owner && repo ? await getOldData(octokit, owner, repo) : {}

  return {
    data,
    oldJson,
    jsonSha,
    userBadges,
  }
}
