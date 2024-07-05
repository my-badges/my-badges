# Contributing

If you want to contribute a badge:

- Add your badge to the [badges](./badges) folder.
- Add your badge to the [index.ts](./badges/index.ts) file.
- Any badge images are welcome (png, 256x256px).

Example of a simple badge: [yeti.ts](./badges/yeti/yeti.ts).

## How to test locally?

Build project with next command:

```sh
npm run build
```

Run main.js with next command:

```sh
node dist/src/main.js your-username
```

This command will collect your data and save it to `data/your-username.json` file.
You can skip recollecting the data with `--data` flag.

```sh
node dist/src/main.js --data data/your-username.json
```

## How to create a badge image?

Most of the badges are generated with AI. An example of a prompt for the AI:

```
A sticker of a panda, white background.
```

Use your favorite tool to remove the background and resize the image to 256x256px.

As always, these badges should be designed and implemented in a way that promotes positivity and inclusivity within the
GitHub community.
