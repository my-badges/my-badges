import { define, Issue, plural } from '#src'

export default define({
  url: import.meta.url,
  tiers: true,
  badges: [
    'old-issue-1',
    'old-issue-2',
    'old-issue-3',
    'old-issue-4',
    'old-issue-5',
    'old-issue-6',
    'old-issue-7',
    'old-issue-8',
    'old-issue-9',
    'old-issue-10',
  ] as const,
  present(data, grant) {
    const buckets: { [years: number]: Issue[] } = {}

    for (const issue of data.issues.sort(age)) {
      if (!issue.closed) continue
      const createdAt = new Date(issue.createdAt)
      const closedAt = new Date(issue.closedAt!)
      let years = Math.floor(
        (closedAt.getTime() - createdAt.getTime()) / 1000 / 60 / 60 / 24 / 365,
      )
      if (years > 10) years = 10
      buckets[years] = buckets[years] || []
      buckets[years].push(issue)
    }

    for (let years = 1; years <= 10; years++) {
      if (!buckets[years]) continue
      grant(
        `old-issue-${years}` as (typeof this.badges)[number],
        `I closed an issue that was open for ${plural(
          years,
          'a year',
          '%d years',
        )}`,
      )
        .evidenceIssuesWithTitles(...buckets[years])
        .tier(years)
    }
  },
})

function age(a: Issue, b: Issue) {
  return new Date(a.closedAt!).getTime() - new Date(b.closedAt!).getTime()
}
