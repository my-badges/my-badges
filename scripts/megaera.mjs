import 'zx/globals'

await $({
  verbose: true,
})`megaera --schema .github/schema.graphql ${await glob('src/**/*.graphql')}`
await $`prettier --write ${await glob('src/**/*.graphql.ts')}`
echo(chalk.green('TypeScript files generated successfully.'))
