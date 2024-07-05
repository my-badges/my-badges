import { define } from '#src'

export default define({
  url: import.meta.url,
  badges: ['covid-19'] as const,
  present(data, grant) {
    const date = new Date(data.user.createdAt)
    if (date.getFullYear() < 2020) {
      grant(
        'covid-19',
        'I rolled before Covid-19: Survivor of the Great TP Shortage',
      )
    }
  },
})
