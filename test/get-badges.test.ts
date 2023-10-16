import * as assert from 'node:assert'
import { describe, it } from 'node:test'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { Octokit } from 'octokit'
import { getBadges, getOldData } from '../src/get-data.js'
import { encodeBase64 } from '../src/utils.js'

const tempy = () => fs.mkdtempSync(path.join(os.tmpdir(), 'tempy-'))

describe('get-badges', () => {
  const octokit = new Octokit({})
  const username = 'antongolub'
  const owner = username
  const repo = username

  it('getBadges() reads snapshot data if dataPath specified', async () => {
    const dataPath = path.join(tempy(), 'data.json')
    const _data = {
      user: {
        id: 'MDQ6VXNlcjUyODgwNDY=',
        login: 'antongolub',
        name: 'Anton Golub',
        createdAt: '2013-08-22T15:51:42Z',
        starredRepositories: {
          totalCount: 161,
        },
      },
      repos: [],
    }
    fs.writeFileSync(dataPath, JSON.stringify(_data), 'utf-8')

    const { data, userBadges, jsonSha, oldJson } = await getBadges(
      octokit,
      dataPath,
      username,
      owner,
      repo,
    )

    assert.deepEqual(_data, data)
    // assert.deepEqual(userBadges, [])
    // assert.equal(jsonSha, undefined)
    // assert.equal(oldJson, undefined)
  })

  it('getBadges() throws an err if `dataPath` is unreachable', async () => {
    try {
      const dataPath = '/foo/bar/baz'
      await getBadges(octokit, dataPath, username, owner, repo)
    } catch (e) {
      assert.equal((e as Error).message, 'Data file not found')
    }
  })

  it('getBadges() throws an err if `username` is empty', async () => {
    try {
      const dataPath = ''
      const username = ''
      await getBadges(octokit, dataPath, username, owner, repo)
    } catch (e) {
      assert.equal((e as Error).message, 'Specify username')
    }
  })

  it('getOldData() returns and processes `my-badges.json` data from the remote', async () => {
    const myBadges = [
      {
        id: 'ab-commit',
        tier: 2,
        desc: 'One of my commit sha starts with "ab".',
        body: '- <a href="https://github.com/semrel-extra/demo-msr-cicd/commit/ab866aea0e5fad02bb2a8d11f753821de13ee78f"><strong>ab</strong>866aea0e5fad02bb2a8d11f753821de13ee78f</a>',
        image:
          'https://github.com/my-badges/my-badges/blob/master/src/all-badges/abc-commit/ab-commit.png?raw=true',
      },
      {
        id: 'stars-1000',
        tier: 3,
        desc: 'I collected 1000 stars.',
        body: 'Repos:\n\n* <a href="https://github.com/imsnif/synp">imsnif/synp: ★710</a>\n* <a href="https://github.com/dhoulb/multi-semantic-release">dhoulb/multi-semantic-release: ★187</a>\n* <a href="https://github.com/antongolub/yarn-audit-fix">antongolub/yarn-audit-fix: ★166</a>\n* <a href="https://github.com/qiwi/multi-semantic-release">qiwi/multi-semantic-release: ★83</a>\n* <a href="https://github.com/antongolub/tsc-esm-fix">antongolub/tsc-esm-fix: ★56</a>\n* <a href="https://github.com/antongolub/npm-registry-firewall">antongolub/npm-registry-firewall: ★50</a>\n* <a href="https://github.com/semrel-extra/zx-semrel">semrel-extra/zx-semrel: ★46</a>\n* <a href="https://github.com/antongolub/action-setup-bun">antongolub/action-setup-bun: ★45</a>\n* <a href="https://github.com/qiwi/pijma">qiwi/pijma: ★31</a>\n* <a href="https://github.com/qiwi/semantic-release-gh-pages-plugin">qiwi/semantic-release-gh-pages-plugin: ★21</a>\n* <a href="https://github.com/qiwi/mixin">qiwi/mixin: ★15</a>\n* <a href="https://github.com/qiwi/nestjs-enterprise">qiwi/nestjs-enterprise: ★14</a>\n* <a href="https://github.com/qiwi/json-rpc">qiwi/json-rpc: ★12</a>\n* <a href="https://github.com/qiwi/substrate">qiwi/substrate: ★8</a>\n* <a href="https://github.com/qiwi/decorator-utils">qiwi/decorator-utils: ★8</a>\n* <a href="https://github.com/antongolub/reqresnext">antongolub/reqresnext: ★7</a>\n* <a href="https://github.com/qiwi/qorsproxy">qiwi/qorsproxy: ★6</a>\n* <a href="https://github.com/qiwi/blank-ts-monorepo">qiwi/blank-ts-monorepo: ★6</a>\n* <a href="https://github.com/antongolub/npm-upgrade-monorepo">antongolub/npm-upgrade-monorepo: ★6</a>\n* <a href="https://github.com/antongolub/nestjs-esm-fix">antongolub/nestjs-esm-fix: ★6</a>\n* <a href="https://github.com/qiwi/blank-ts-repo">qiwi/blank-ts-repo: ★5</a>\n* <a href="https://github.com/qiwi/QiwiButtons">qiwi/QiwiButtons: ★4</a>\n* <a href="https://github.com/qiwi/primitive-storage">qiwi/primitive-storage: ★4</a>\n* <a href="https://github.com/dhoulb/blork">dhoulb/blork: ★4</a>\n* <a href="https://github.com/qiwi/protopipe">qiwi/protopipe: ★3</a>\n* <a href="https://github.com/qiwi/mware">qiwi/mware: ★3</a>\n* <a href="https://github.com/antongolub/git-glob-cp">antongolub/git-glob-cp: ★3</a>\n* <a href="https://github.com/antongolub/demo-action-setup-bun">antongolub/demo-action-setup-bun: ★3</a>\n* <a href="https://github.com/qiwi-forks/esm">qiwi-forks/esm: ★2</a>\n* <a href="https://github.com/qiwi/health-indicator">qiwi/health-indicator: ★2</a>\n* <a href="https://github.com/antongolub/push-it-to-the-limit">antongolub/push-it-to-the-limit: ★2</a>\n* <a href="https://github.com/antongolub/lockfile">antongolub/lockfile: ★2</a>\n* <a href="https://github.com/antongolub/blank-ts">antongolub/blank-ts: ★2</a>\n* <a href="https://github.com/qiwi-forks/dts-bundle">qiwi-forks/dts-bundle: ★1</a>\n* <a href="https://github.com/qiwi/thromise">qiwi/thromise: ★1</a>\n* <a href="https://github.com/qiwi/stdstream-snapshot">qiwi/stdstream-snapshot: ★1</a>\n* <a href="https://github.com/qiwi/queuefy">qiwi/queuefy: ★1</a>\n* <a href="https://github.com/qiwi/logwrap">qiwi/logwrap: ★1</a>\n* <a href="https://github.com/qiwi/ldap">qiwi/ldap: ★1</a>\n* <a href="https://github.com/qiwi/inside-out-promise">qiwi/inside-out-promise: ★1</a>\n* <a href="https://github.com/qiwi/common-formatters">qiwi/common-formatters: ★1</a>\n* <a href="https://github.com/qiwi/card-info">qiwi/card-info: ★1</a>\n* <a href="https://github.com/antongolub/repeater">antongolub/repeater: ★1</a>\n* <a href="https://github.com/antongolub/flow-remove-types-recursive">antongolub/flow-remove-types-recursive: ★1</a>\n* <a href="https://github.com/antongolub/akshenz">antongolub/akshenz: ★1</a>\n* <a href="https://github.com/antongolub/abstractest">antongolub/abstractest: ★1</a>\n\n<sup>I have push, maintainer or admin permissions, so I\'m definitely an author.<sup>\n',
        image:
          'https://github.com/my-badges/my-badges/blob/master/src/all-badges/stars/stars-1000.png?raw=true',
      },
    ]
    const mockedRes = {
      data: {
        content: encodeBase64(JSON.stringify(myBadges)),
        sha: 'sha',
      },
    }
    const res = await getOldData(octokit, owner, repo, mockedRes)

    assert.equal(res.jsonSha, mockedRes.data.sha)
    assert.deepEqual(res.userBadges, myBadges)
  })
})
