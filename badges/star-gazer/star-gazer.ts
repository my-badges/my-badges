import { define } from '#src'

export default define({
  url: import.meta.url,
  badges: ['star-gazer', 'self-star'] as const,
  present(data, grant) {
    if (data.user.starredRepositories?.totalCount >= 1000) {
      grant('star-gazer', "I'm a star gazer!").evidence(
        "I've starred over 1000 repositories!",
      )
    }

    const selfStars: { nameWithOwner: string; url: string }[] = []
    for (const repo of data.starredRepositories) {
      if (repo.owner.login === data.user.login) {
        selfStars.push({ nameWithOwner: repo.nameWithOwner, url: repo.url })
      }
    }

    if (selfStars.length >= 1) {
      grant(
        'self-star',
        `I've starred ${selfStars.length} my own repositories.`,
      ).evidence(
        selfStars
          .map((x) => `- <a href="${x.url}">${x.nameWithOwner}</a>`)
          .join('\n'),
      )
    }
  },
})
