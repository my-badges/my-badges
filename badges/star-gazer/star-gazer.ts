import { define } from '#src'

export default define({
  url: import.meta.url,
  badges: ['star-gazer'] as const,
  present(data, grant) {
    if (data.user.starredRepositories?.totalCount >= 1000) {
      grant('star-gazer', "I'm a star gazer!").evidence(
        "I've starred over 1000 repositories!",
      )
    }
  },
})
