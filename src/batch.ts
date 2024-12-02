import { TaskName } from './task.js'

export function createBatcher(next: (taskName: TaskName, params: any) => void) {
  const batches = new Map<TaskName, string[]>()

  function batch(paginate: TaskName, batch: TaskName, maxPerBatch = 50) {
    return function (count: number, id: string) {
      if (count == 0) {
        return
      }
      if (count > 100) {
        next(paginate, { id })
      } else {
        let ids = batches.get(batch) ?? []
        ids.push(id)
        if (ids.length >= maxPerBatch) {
          next(batch, { ids })
          ids = []
        }
        batches.set(batch, ids)
      }
    }
  }

  function flush() {
    for (const [batch, ids] of batches.entries()) {
      next(batch, { ids })
      batches.delete(batch)
    }
  }

  return { batch, flush }
}

export type BatchFn = ReturnType<typeof createBatcher>['batch']
