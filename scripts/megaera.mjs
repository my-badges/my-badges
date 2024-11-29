import 'zx/globals'

await $`megaera --schema .github/schema.graphql ${await glob('src/**/*.graphql')}`.verbose()
await $`prettier --write ${await glob('src/**/*.graphql.ts')}`
echo(chalk.green('TypeScript files generated successfully.'))
