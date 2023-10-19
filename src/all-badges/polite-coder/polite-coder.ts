import { BadgePresenter, Present } from '../../badges.js'
import { linkIssue } from '../../utils.js'

export default new (class implements BadgePresenter {
  url = new URL(import.meta.url)
  badges = ['polite-coder', 'rebel-coder'] as const
  present: Present = (data, grant) => {
    if (data.issues.length <= 10) {
      return
    }

    const politeRegexp = /thanks?|please/i

    const politeIssues = data.issues.filter(
      (issue) =>
        politeRegexp.test(issue.title) || politeRegexp.test(issue.body),
    )

    if (politeIssues.length > 0) {
      grant('polite-coder', 'I am a polite coder.').evidence(
        'I use words like "thanks" and "please" in my issues:\n\n' +
          politeIssues
            .slice(0, 5)
            .map((x) => `- ${linkIssue(x)}: ${x.title}`)
            .join('\n') +
          (politeIssues.length > 5 ? '\n\n And many more...' : ''),
      )
    } else {
      grant('rebel-coder', 'I am a rebel coder.').evidence(
        'I do not use words like "thanks" and "please" in my issues.\n' +
          'Straight to the point!',
      )
    }
  }
})()
