import { Octokit } from 'octokit'
import { retry } from '@octokit/plugin-retry'
import { throttling } from '@octokit/plugin-throttling'

const MyOctokit = Octokit.plugin(retry, throttling)
const clients: Map<string, Octokit> = new Map()
export const getOctokit = (token: string): Octokit => {
  if (clients.has(token)) {
    return clients.get(token) as Octokit
  }

  const octokit = new MyOctokit({
    auth: token,
    log: console,
    throttle: {
      onRateLimit: (retryAfter, options: any, octokit, retryCount) => {
        octokit.log.warn(
          `Request quota exhausted for request ${options.method} ${options.url}`,
        )
        if (retryCount <= 3) {
          octokit.log.info(`Retrying after ${retryAfter} seconds!`)
          return true
        }
      },
      onSecondaryRateLimit: (retryAfter, options: any, octokit) => {
        octokit.log.warn(
          `SecondaryRateLimit detected for request ${options.method} ${options.url}`,
        )
      },
    },
    retry: { doNotRetry: ['429'] },
  })

  clients.set(token, octokit)

  return octokit
}
