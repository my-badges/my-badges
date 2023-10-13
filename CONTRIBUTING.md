# Contributing

If you want to contribute a badge:

- Add your badge to the [all-badges](./src/all-badges) folder.
- Add your badge to the [index.ts](./src/all-badges/index.ts) file.
- Any badge images are welcome (png, 256x256px).

Here is an [example of a pull request](https://github.com/my-badges/my-badges/pull/1) adding a new badge.

## How to test locally?

Build project with next command:

```sh
npm run build
```

Run main.js with next command:

```sh
node dist/main.js your-username
```

This command will collect your data and save it to `data/your-username.json` file.
You can skip recollecting the data with `--data` flag.

```sh
node dist/main.js --data data/your-username.json
```

## How to create a badge image?

Most of the badges are generated with AI. An example of a prompt for the AI:

```
A sticker of a panda, white background.
```

Use your favorite tool to remove the background and resize the image to 256x256px.

## Ideas for badges

Feel free to grab any of these ideas and implement them:

### Commit Patterns & Styles

- **weekend-warrior** - For those who commit mostly on weekends.
- **caffeine-fueled** - For a burst of commits at odd hours, implying lots of coffee.
- **ninja-commit** - Silent commits with minimal descriptions.
- **commit-haiku** - Commit descriptions that are in the format of a haiku.
- **emoji-only** - For commit messages that use only emojis.
- **oops-fix** - For commits that quickly follow a previous commit to fix something minor.
- **one-liner** - For commits that change only one line.
- **marathoner** - For long coding sessions with many commits.
- **holiday-coder** - Commits made on holidays.
- **spooky-commit** - Commits made on Halloween or commits with spooky-themed messages.
- **commit-celebration** - Commits made on the user's birthday or GitHub anniversary.

### Coding Quality & Craftsmanship

- **code-poet** - For beautifully written code.
- **code-sorcerer** - For intricate or complex code changes.
- **code-detective** - For commits that solve difficult bugs or mysteries.
- **merge-master** - For those who handle a lot of merges without conflicts.
- **no-conflict** - For users who rarely have merge conflicts.

### Documentation & Comments

- **comment-ninja** - A lot of comments added in a commit.
- **docs-rockstar** - For those who make significant contributions to documentation.
- **wiki-warrior** - For contributors to the GitHub Wiki pages of repositories.

### Repository & Community Engagement

- **collaborator-king** - For users who have been added as collaborators on numerous repositories.
- **issue-master** - For users who open a significant number of issues across repositories.
- **pr-champion** - For those who have a high number of pull requests merged.
- **community-builder** - For users with a high number of followers or those who contribute to popular community-driven
  projects.
- **fork-fanatic** - For those who have forked a large number of repositories.
- **watcher** - For users who watch a high number of repositories, staying updated with many projects.
- **social-butterfly** - For those with a high number of interactions (comments, reactions) across GitHub.

### Project & Issue Management

- **bug-buster** - For users who have closed many bug-labeled issues.
- **enhancer** - For users who have closed many enhancement-labeled issues.
- **milestone-mover** - For users who consistently hit project milestones or participate in milestone discussions.
- **security-sentinel** - Recognizing those who report security vulnerabilities through responsible disclosure.
- **roadmap-runner** - For those who actively participate in project roadmaps or long-term planning discussions.

### Learning & Growth

- **learning-curve** - For those who regularly commit to repositories tagged with educational or tutorial topics.
- **diversity-driver** - For those who contribute to repositories tagged with diversity, inclusion, or community
  well-being topics.

### Versatility & Multitasking

- **commit-chameleon** - For users who often change the style or language of their code.
- **timezone-hopper** - For those who commit at varied hours, implying they might be traveling or working across time
  zones.
- **triple-threat** - For users who open issues, commit code, and review pull requests consistently.
- **dual-language-dynamo** - For those who commit in at least two different programming languages consistently.

### Contributions & Role

- **repository-ronin** - For users who don’t own repositories but contribute significantly to others.
- **feedback-friend** - For users who comment constructively on issues and pull requests.
- **open-source-orchestrator** - For those who have initiated or lead popular open-source projects.

### Miscellaneous & Fun

- **theme-thinker** - For users who frequently switch or customize their GitHub UI themes.
- **bot-buddy** - Users who integrate or collaborate with bots for automated checks or messages.
- **first-timer** - Celebrating someone's first commit to a project.
- **no-tests** - No tests added or changed in the commit.
- **ancient-code** - For updating or working with very old code repositories.
- **sleepy-coder** - For commits made in the very early hours of the morning.
- **streaker** - For users with long daily commit streaks.

As always, these badges should be designed and implemented in a way that promotes positivity and inclusivity within the
GitHub community.
