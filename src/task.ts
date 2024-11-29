import { Octokit } from 'octokit'
import { Data } from './data.js'
import allTasks from './task/index.js'

export type TaskName = (typeof allTasks)[number]['default']['name']

type Context = {
  octokit: Octokit
  data: Data
  next: (taskName: TaskName, params: any) => void
}

type Task<Name extends string> = {
  name: Name
  run: (context: Context, params: any) => Promise<void>
}

export function task<Name extends string>(t: Task<Name>) {
  return t
}
