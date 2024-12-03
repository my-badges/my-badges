import fs from 'node:fs'
import { GraphqlResponseError } from '@octokit/graphql'
import { Data } from './data.js'
import { TaskName } from './task.js'
import allTasks from './task/index.js'

import { type Context } from './context.js'
import { createBatcher } from './batch.js'

const MAX_ATTEMPTS = 3

export async function processTasks(
  ctx: Pick<
    Context,
    | 'octokit'
    | 'ghUser'
    | 'dataDir'
    | 'dataFile'
    | 'dataTasks'
    | 'taskName'
    | 'taskSkip'
    | 'taskParams'
  >,
): Promise<[boolean, Data]> {
  const {
    octokit,
    ghUser: username,
    dataFile,
    dataTasks,
    taskSkip,
    taskName,
    taskParams,
  } = ctx
  const taskSkipSet = new Set(taskSkip?.split(',') || [])

  let data: Data = {
    user: null!,
    starredRepositories: [],
    repos: [],
    pulls: [],
    issues: [],
    issueComments: [],
    discussionComments: [],
  }

  if (fs.existsSync(dataFile)) {
    data = JSON.parse(fs.readFileSync(dataFile, 'utf8')) as Data
  }

  type Todo = {
    taskName: TaskName
    params: any
    attempts: number
  }

  let todo: Todo[] = [
    { taskName: 'user', params: { username }, attempts: 0 },
    { taskName: 'pulls', params: { username }, attempts: 0 },
    { taskName: 'issues', params: { username }, attempts: 0 },
    { taskName: 'issue-comments', params: { username }, attempts: 0 },
    { taskName: 'discussion-comments', params: { username }, attempts: 0 },
    { taskName: 'stars', params: { username }, attempts: 0 },
  ]

  if (taskName && taskParams) {
    todo = [
      {
        taskName: taskName as TaskName,
        params: Object.fromEntries(new URLSearchParams(taskParams).entries()),
        attempts: 0,
      },
    ]
  } else if (fs.existsSync(dataTasks)) {
    const savedTodo = JSON.parse(fs.readFileSync(dataTasks, 'utf8')) as Todo[]
    if (savedTodo.length > 0) {
      todo = savedTodo
    }
  }

  while (todo.length > 0) {
    const { taskName, params, attempts } = todo.shift()!
    if (taskSkipSet.has(taskName)) {
      console.log(`Skipping task ${taskName}`)
      continue
    }

    const task = allTasks.find(({ default: t }) => t.name === taskName)?.default
    if (!task) {
      throw new Error(`Unknown task ${taskName}`)
    }

    const next = (taskName: TaskName, params: any) => {
      todo.push({ taskName, params, attempts: 0 })
    }
    const { batch, flush } = createBatcher(next)

    console.log(
      `==> Running task ${taskName}`,
      new URLSearchParams(params).toString(),
      attempts > 0 ? `(attempt: ${attempts + 1})` : '',
    )
    try {
      await task.run({ octokit, data, next, batch }, params)
    } catch (e) {
      let retry = true
      if (e instanceof GraphqlResponseError) {
        retry = e.errors?.some((error) => error.type == 'NOT_FOUND') ?? true
      }

      if (attempts >= MAX_ATTEMPTS || !retry) {
        console.error(
          `!!! Failed to run task ${taskName}`,
          new URLSearchParams(params).toString(),
          `after ${attempts} attempts`,
        )
        console.error(e)
      } else {
        console.error(
          `!!! Failed to run task ${taskName}`,
          new URLSearchParams(params).toString(),
          `retrying`,
          `(will try ${MAX_ATTEMPTS - attempts} more times)`,
        )
        console.error(e)
        todo.push({ taskName, params, attempts: attempts + 1 })
      }
    }
    console.log(`<== Finished ${taskName} (${todo.length} tasks left)`)

    flush()

    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
    fs.writeFileSync(dataTasks, JSON.stringify(todo, null, 2))
  }

  return [true, data]
}
