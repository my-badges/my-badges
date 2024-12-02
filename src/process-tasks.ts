import fs from 'node:fs'
import { Octokit } from 'octokit'
import { GraphqlResponseError } from '@octokit/graphql'
import { Data } from './data.js'
import { TaskName } from './task.js'
import allTasks from './task/index.js'
import { createBatcher } from './batch.js'

const MAX_ATTEMPTS = 3

export async function processTasks(
  octokit: Octokit,
  username: string,
  {
    task,
    params,
    skipTask,
  }: { task?: string; params?: string; skipTask?: string } = {},
): Promise<[boolean, Data]> {
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data')
  }
  const dataPath = `data/${username}.json`
  const tasksPath = `data/${username}.tasks.json`
  const skipTasks = new Set(skipTask?.split(',') || [])

  let data: Data = {
    user: null!,
    starredRepositories: [],
    repos: [],
    pulls: [],
    issues: [],
    issueComments: [],
    discussionComments: [],
  }

  if (fs.existsSync(dataPath)) {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8')) as Data
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

  if (task && params) {
    todo = [
      {
        taskName: task as TaskName,
        params: Object.fromEntries(new URLSearchParams(params).entries()),
        attempts: 0,
      },
    ]
  } else if (fs.existsSync(tasksPath)) {
    const savedTodo = JSON.parse(fs.readFileSync(tasksPath, 'utf8')) as Todo[]
    if (savedTodo.length > 0) {
      todo = savedTodo
    }
  }

  while (todo.length > 0) {
    const { taskName, params, attempts } = todo.shift()!
    if (skipTasks.has(taskName)) {
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

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
    fs.writeFileSync(tasksPath, JSON.stringify(todo, null, 2))
  }

  return [true, data]
}
