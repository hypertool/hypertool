# Structure

In this document, we describe how the [Hypertool](https://github.com/hypertool/hypertool) repository is structured. Package-specific
details are documented in their respective documents.

Hypertool follows a monorepo strategy. In other words, instead of maintaining
our projects across multiple repositories, we maintain a single repository.
It should be noted that monorepos and monolithic applications are unrelated
concepts.

-   `.husky`

    Hypertool uses Git hooks via [Husky](https://www.npmjs.com/package/husky) for various reasons like running Prettier, ESLint, and so on. The `.husky` directory contains bash scripts that are triggered by Husky.

-   `.vscode`

    At Hypertool, we primarily use VSCode for editing our souce code. The `.vscode` directory configures a workspace with common preferences for all our developers by overriding global user settings.

    You can read more about this [here](https://code.visualstudio.com/docs/editor/workspaces).

-   `docs`

    The documentation is stored in the `docs` directory. As of this writing, all the
    documentation is written in Markdown.

-   `packages`

    The `packages` directory contains all the packages, that is, projects that would
    normally be split across multiple repositories.

-   `.gitignore`

    Configures a list of globs identifiying paths that should be ignored by Git.
    Individual packages are further encouraged to specify their own `.gitignore`
    files.

-   `lerna.json`

    The configuration for Lerna goes in `lerna.json`.

    The official documentation for Lerna states "Lerna is a tool that optimizes the
    workflow around managing multi-package repositories with git and npm." You can
    read more about Lerna [here](https://lerna.js.org).

-   `package.json`

    The `package.json` contains dependencies and configuration that are common to
    all the packages in the workspace. For example, Husky is listed as a development
    dependency and configured for the entire workspace in `package.json`.
