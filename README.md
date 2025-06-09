# Ink

A modern web application built with Astro and TailwindCSS.

## Project Overview

Ink is a sleek, responsive web application that demonstrates modern web development practices using Astro, TailwindCSS, and Three.js.

## Technologies Used

- [Astro](https://astro.build/) - Fast, modern static site generator
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Three.js](https://threejs.org/) - 3D graphics library

## Getting Started

1. Clone the repository
   ```
   git clone https://github.com/axellstr/ink.git
   cd ink
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Build for production
   ```
   npm run build
   ```

## Deployment on Vercel

This project is configured for seamless deployment on Vercel:

1. Push your repository to GitHub
2. Import your repository on [Vercel](https://vercel.com/new)
3. Vercel will detect Astro and use the appropriate build settings automatically
4. Click "Deploy"

Alternatively, you can deploy directly from the CLI:

```
npm install -g vercel
vercel
```

## Project Structure

```
/
├── public/       # Static assets
├── src/
│   ├── components/  # UI components
│   ├── data/        # Data files
│   ├── pages/       # Page components and routing
│   ├── scripts/     # JavaScript utilities
│   └── styles/      # Global styles
└── package.json
```

## License

MIT

```sh
npm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
