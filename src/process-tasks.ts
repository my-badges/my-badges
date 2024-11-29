import fs from 'node:fs'
import { Octokit } from 'octokit'
import { Data } from './data.js'
import { TaskName } from './task.js'
import allTasks from './task/index.js'

export async function processTasks(
  octokit: Octokit,
  username: string,
): Promise<[boolean, Data]> {
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data')
  }
  const dataPath = `data/${username}.json`
  const tasksPath = `data/${username}.tasks.json`

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
    { taskName: 'repos', params: { username }, attempts: 0 },
    { taskName: 'pulls', params: { username }, attempts: 0 },
    { taskName: 'issues', params: { username }, attempts: 0 },
    { taskName: 'issue-comments', params: { username }, attempts: 0 },
    { taskName: 'discussion-comments', params: { username }, attempts: 0 },
    { taskName: 'stars', params: { username }, attempts: 0 },
  ]

  if (fs.existsSync(tasksPath)) {
    const savedTodo = JSON.parse(fs.readFileSync(tasksPath, 'utf8')) as Todo[]
    if (savedTodo.length > 0) {
      todo = savedTodo
    }
  }

  while (todo.length > 0) {
    const { taskName, params, attempts } = todo.shift()!

    const task = allTasks.find(({ default: t }) => t.name === taskName)?.default
    if (!task) {
      throw new Error(`Unknown task ${taskName}`)
    }

    const next = (taskName: TaskName, params: any) => {
      todo.push({ taskName, params, attempts: 0 })
    }

    console.log(`==> Running task ${taskName}`, params)
    try {
      await task.run({ octokit, data, next }, params)
    } catch (e) {
      if (attempts >= 3) {
        console.error(
          `!!! Failed to run task ${taskName}`,
          params,
          `after ${attempts} attempts`,
        )
        console.error(e)
      } else {
        console.error(
          `!!! Failed to run task ${taskName}`,
          params,
          `, retrying... (attempts: ${attempts + 1})`,
        )
        console.error(e)
        todo.push({ taskName, params, attempts: attempts + 1 })
      }
    }
    console.log(`<== Finished ${taskName} (${todo.length} tasks left)`)

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
    fs.writeFileSync(tasksPath, JSON.stringify(todo, null, 2))
  }

  return [true, data]
}
