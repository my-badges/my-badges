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

  let todo: [TaskName, any][] = [
    ['user', { username }],
    ['repos', { username }],
    ['pulls', { username }],
    ['issues', { username }],
    ['issue-timeline', { username, name: 'my-badges', number: 42 }],
    ['issue-comments', { username }],
    ['discussion-comments', { username }],
    ['stars', { username }],
  ]

  if (fs.existsSync(tasksPath)) {
    const savedTodo = JSON.parse(fs.readFileSync(tasksPath, 'utf8')) as [
      TaskName,
      any,
    ][]
    if (savedTodo.length > 0) {
      todo = savedTodo
    }
  }

  while (todo.length > 0) {
    const [taskName, params] = todo.shift()!

    const task = allTasks.find(({ default: t }) => t.name === taskName)?.default
    if (!task) {
      throw new Error(`Unknown task ${taskName}`)
    }

    const next = (taskName: TaskName, params: any) => {
      todo.push([taskName, params])
    }

    console.log(`==> Running task ${taskName}`, params)
    try {
      await task.run({ octokit, data, next }, params)
    } catch (e) {
      console.error(`!!! Failed to run task ${taskName}`, params)
      console.error(e)
    }
    console.log(`<== Finished ${taskName} (${todo.length} tasks left)`)

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
    fs.writeFileSync(tasksPath, JSON.stringify(todo, null, 2))
  }

  return [true, data]
}
