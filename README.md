<h1><img src=".github/logo.png" alt="My Badges" height="40" align="center"> My Badges</h1>

**Welcome to My Badges!**

Think of My Badges as a fun twist on GitHub's achievements. We've added a dash of humor and variety, bringing you badges
that are quirky and different!

🔧 **Integration is Easy!**

You can effortlessly integrate My Badges into your GitHub profile. With our automatic updating action, your badges stay
fresh. Whenever you unlock a new badge or the community adds a fresh one, it updates daily.

👀 **Curious to see them in action?**

Check out how these badges sparkle on [my profile](https://github.com/antonmedv).

## List of badges

<p>
<img src="src/all-badges/abc-commit/a-commit.png" alt="a-commit" width="64">
<img src="src/all-badges/abc-commit/ab-commit.png" alt="ab-commit" width="64">
<img src="src/all-badges/abc-commit/abc-commit.png" alt="abc-commit" width="64">
<img src="src/all-badges/abc-commit/abcd-commit.png" alt="abcd-commit" width="64">
<img src="src/all-badges/abc-commit/abcde-commit.png" alt="abcde-commit" width="64">
<img src="src/all-badges/abc-commit/abcdef-commit.png" alt="abcdef-commit" width="64">
<img src="src/all-badges/stars/stars-100.png" alt="stars-100" width="64">
<img src="src/all-badges/stars/stars-500.png" alt="stars-500" width="64">
<img src="src/all-badges/stars/stars-1000.png" alt="stars-1000" width="64">
<img src="src/all-badges/stars/stars-2000.png" alt="stars-2000" width="64">
<img src="src/all-badges/stars/stars-5000.png" alt="stars-5000" width="64">
<img src="src/all-badges/stars/stars-10000.png" alt="stars-10000" width="64">
<img src="src/all-badges/stars/stars-20000.png" alt="stars-20000" width="64">
<img src="src/all-badges/time-of-commit/midnight-commits.png" alt="midnight-commits" width="64">
<img src="src/all-badges/time-of-commit/morning-commits.png" alt="morning-commits" width="64">
<img src="src/all-badges/time-of-commit/evening-commits.png" alt="evening-commits" width="64">
<img src="src/all-badges/yeti/yeti.png" alt="yeti" width="64">
<img src="src/all-badges/star-gazer/star-gazer.png" alt="star-gazer" width="64">
<img src="src/all-badges/dead-commit/dead-commit.png" alt="dead-commit" width="64">
<img src="src/all-badges/bad-words/bad-words.png" alt="bad-words" width="64">
<img src="src/all-badges/mass-delete-commit/mass-delete-commit.png" alt="mass-delete-commit" width="64">
<img src="src/all-badges/mass-delete-commit/mass-delete-commit-10k.png" alt="mass-delete-commit-10k" width="64">
<img src="src/all-badges/revert-revert-commit/revert-revert-commit.png" alt="revert-revert-commit" width="64">
<img src="src/all-badges/my-badges-contributor/my-badges-contributor.png" alt="my-badges-contributor" width="64">
<img src="src/all-badges/fix-commit/fix-2.png" alt="fix-2" width="64">
<img src="src/all-badges/fix-commit/fix-3.png" alt="fix-3" width="64">
<img src="src/all-badges/fix-commit/fix-4.png" alt="fix-4" width="64">
<img src="src/all-badges/fix-commit/fix-5.png" alt="fix-5" width="64">
<img src="src/all-badges/fix-commit/fix-6.png" alt="fix-6" width="64">
<img src="src/all-badges/fix-commit/fix-6+.png" alt="fix-6+" width="64">
<img src="src/all-badges/chore-commit/chore-commit.png" alt="chore-commit" width="64">
</p>

But we are planning on adding much more. **Add your own badges too**!

## Usage

Here is how to add my badges to your profile:

- Star this repository.
- Create `your-username/your-username` repository.
- In `README.md` add the following code:

```html
<!-- my-badges start -->
<!-- my-badges end -->
```

- Add the following workflow `.github/workflows/my-badges.yml` to your repository.

```yaml
name: my-badges

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * *'

permissions:
  contents: write

jobs:
  my-badges:
    runs-on: ubuntu-latest
    steps:
      - name: Update My Badges
        run: npx update-my-badges ${{github.repository_owner}} --repo=${{ github.repository }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- Start **my-badges** workflow, or wait for it to run automatically.

## Configuration
| Param    | ENV alias      | Description                                                                               | Default |
|----------|----------------|-------------------------------------------------------------------------------------------|---------|
| `token`  | `GITHUB_TOKEN` | Auth token                                                                                |         |
| `user`   | `GITHUB_USER`  | Username                                                                                  |         |
| `repo`   | `GITHUB_REPO`  | Repository name                                                                           |         |
| `data`   |                | Path to JSON to generate badges. If empty, required data will be obtained from the GH API |         |
| `size`   |                | Badge size for README.md, px                                                              | 64      |
| `dryrun` |                | Generate badges, but skip pushing to git                                                  |         |

## Contributing badges

If you want to contribute a badge:

- Add your badge to the [all-badges](./src/all-badges) folder.
- Add your badge to the [index.ts](./src/all-badges/index.ts) file.
- Any badge images are welcome (png, 256x256px).

Here is an [example of a pull request](https://github.com/my-badges/my-badges/pull/1) adding a new badge.

### How to test locally?

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

### How to create a badge image?

Most of the badges are generated with AI. An example of a prompt for the AI:

```
A sticker of a panda, white background.
```

Use your favorite tool to remove the background and resize the image to 256x256px.

### Ideas for badges

Feel free to grab any of these ideas and implement them:

#### Commit Patterns & Styles

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

#### Coding Quality & Craftsmanship

- **code-poet** - For beautifully written code.
- **code-sorcerer** - For intricate or complex code changes.
- **code-detective** - For commits that solve difficult bugs or mysteries.
- **merge-master** - For those who handle a lot of merges without conflicts.
- **no-conflict** - For users who rarely have merge conflicts.

#### Documentation & Comments

- **comment-ninja** - A lot of comments added in a commit.
- **docs-rockstar** - For those who make significant contributions to documentation.
- **wiki-warrior** - For contributors to the GitHub Wiki pages of repositories.

#### Repository & Community Engagement

- **collaborator-king** - For users who have been added as collaborators on numerous repositories.
- **issue-master** - For users who open a significant number of issues across repositories.
- **pr-champion** - For those who have a high number of pull requests merged.
- **community-builder** - For users with a high number of followers or those who contribute to popular community-driven
  projects.
- **fork-fanatic** - For those who have forked a large number of repositories.
- **watcher** - For users who watch a high number of repositories, staying updated with many projects.
- **social-butterfly** - For those with a high number of interactions (comments, reactions) across GitHub.

#### Project & Issue Management

- **bug-buster** - For users who have closed many bug-labeled issues.
- **enhancer** - For users who have closed many enhancement-labeled issues.
- **milestone-mover** - For users who consistently hit project milestones or participate in milestone discussions.
- **security-sentinel** - Recognizing those who report security vulnerabilities through responsible disclosure.
- **roadmap-runner** - For those who actively participate in project roadmaps or long-term planning discussions.

#### Learning & Growth

- **learning-curve** - For those who regularly commit to repositories tagged with educational or tutorial topics.
- **diversity-driver** - For those who contribute to repositories tagged with diversity, inclusion, or community
  well-being topics.

#### Versatility & Multitasking

- **commit-chameleon** - For users who often change the style or language of their code.
- **timezone-hopper** - For those who commit at varied hours, implying they might be traveling or working across time
  zones.
- **triple-threat** - For users who open issues, commit code, and review pull requests consistently.
- **dual-language-dynamo** - For those who commit in at least two different programming languages consistently.

#### Contributions & Role

- **repository-ronin** - For users who don’t own repositories but contribute significantly to others.
- **feedback-friend** - For users who comment constructively on issues and pull requests.
- **open-source-orchestrator** - For those who have initiated or lead popular open-source projects.

#### Miscellaneous & Fun

- **theme-thinker** - For users who frequently switch or customize their GitHub UI themes.
- **bot-buddy** - Users who integrate or collaborate with bots for automated checks or messages.
- **first-timer** - Celebrating someone's first commit to a project.
- **no-tests** - No tests added or changed in the commit.
- **ancient-code** - For updating or working with very old code repositories.
- **sleepy-coder** - For commits made in the very early hours of the morning.
- **streaker** - For users with long daily commit streaks.

As always, these badges should be designed and implemented in a way that promotes positivity and inclusivity within the
GitHub community.

## License

[MIT](LICENSE)
