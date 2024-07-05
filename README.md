<a href="https://github.com/my-badges/my-badges"><img src=".github/my-badges.png" alt="My Badges"></a>

# My Badges

— _Do you like GitHub Achievements?_  
— _Do you want to get more badges?_  
— _We got you covered!_

**My Badges** is a GitHub Action that generates badges for your profile README.md.
Badges will be updated automatically every day. And you will get new badges as you progress, or
as community adds new badges. **Yes, you can [add your own badges](CONTRIBUTING.md)!**

But how does those badges look like? Take a look [here](https://github.com/antonmedv),
or [here](https://github.com/antongolub).

<p>
<img src="badges/stars/stars-20000.png" alt="stars-20000" width="64">
<img src="badges/time-of-commit/morning-commits.png" alt="morning-commits" width="64">
<img src="badges/dead-commit/dead-commit.png" alt="dead-commit" width="64">
<img src="badges/bad-words/bad-words.png" alt="bad-words" width="64">
<img src="badges/delorean/delorean.png" alt="delorean" width="64">
<img src="badges/public-keys/public-keys-1.png" alt="public-keys-1" width="64">
<img src="badges/old-issue/old-issue-1.png" alt="old-issue-1" width="64">
<img src="badges/this-is-fine/this-is-fine.png" alt="this-is-fine" width="64">
<img src="badges/the-ultimate-question/the-ultimate-question.png" alt="the-ultimate-question" width="64">
<img src="badges/favorite-word/favorite-word.png" alt="favorite-word" width="64">
<img src="badges/cosmetic-commit/cosmetic-commit.png" alt="cosmetic-commit" width="64">
<img src="badges/cafe-commit/cafe-commit.png" alt="cafe-commit" width="64">
</p>

## Installation

Create `your-username/your-username` [GH profile repository](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme).

Add the following code somewhere in `README.md`:

```html
<!-- my-badges start -->
<!-- my-badges end -->
```

Add the following workflow `.github/workflows/my-badges.yml` to your repository:

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
        run: npx update-my-badges ${{github.repository_owner}}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

> [!NOTE]
> You don't need to create a `GITHUB_TOKEN` in repository. The workflow will use a default runner token.

Start **my-badges** workflow, or wait for it to run automatically.

## Configuration

| Param   | ENV alias      | Description                    | Default       |
|---------|----------------|--------------------------------|---------------|
| `token` | `GITHUB_TOKEN` | Auth token                     |               |
| `user`  | `GITHUB_USER`  | Username                       |               |
| `repo`  | `GITHUB_REPO`  | Repository name to push badges | `{user/user}` |

<details>
<summary>Additional params</summary>

| Param     | Description                                                                                                                                             | Default |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| `data`    | Path to JSON to generate badges. If empty, required data will be obtained from the GH API                                                               |         |
| `size`    | Badge size for README.md, px                                                                                                                            | 64      |
| `dryrun`  | Generate badges, but skip pushing them to git                                                                                                           |         |
| `pick`    | List of badges to pick. Pass `--pick="a-commit,ab-commit,revert-revert-commit"` to generate only the specified entries. If empty gets all of them       |         |
| `omit`    | List of badges to exclude. For example, if you're too shy to flex your stars: `--omit:stars-100,stars-500,stars-1000` or even shorter `--omit:stars-*`  |         |
| `compact` | Represent the highest tier badges in README.md. For example, If you have both `stars-100` and `stars-500` achievements, only the last one will be shown |         |

</details>

### Manual Run

```sh
npx update-my-badges <username>
```

## License

[MIT](LICENSE)
