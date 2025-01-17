export default define({
  url: import.meta.url,
  badges: ['conventional-commit'] as const,
  present(data, grant) {
    grant('conventional-commit', 'I use conventional commit messages').evidence('')
  },
})

