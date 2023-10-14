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

As always, these badges should be designed and implemented in a way that promotes positivity and inclusivity within the
GitHub community.
