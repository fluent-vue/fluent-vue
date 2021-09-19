# fluent-vue Contributing Guide

- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)

## General Guidelines

English is used as the common language to communicate with Maintainers. If description of issue / PR are written in
non-English languages, those may be closed.

## Issue Reporting Guidelines

- Try to search for your issue, it may have already been answered or even fixed in the development branch.

- Check if the issue is reproducible with the latest stable version of Vue. If you are using a pre-release, please
  indicate the specific version you are using.

- It is **required** that you clearly describe the steps necessary to reproduce the issue you are running into. Issues with no clear reproduction steps may be closed. If an issue labeled "need repro" receives no further input from the issue author for more than 5 days, it will be closed.

- For bugs that involves build setups, you can create a reproduction repository with steps in the `README` file.

- If your issue is resolved but still open, don’t hesitate to close it. In case you found a solution by yourself, it could be helpful to explain how you fixed it.

## Pull Request Guidelines

- Make sure `yarn test` passes. (see [development setup](#development-setup))

- If adding new feature:

  - Add accompanying test case.

  - Provide convincing reason to add this feature. Ideally you should open a suggestion issue first to discuss with the Maintainers/Community before working on it.

- If fixing a bug:
  - Provide detailed description of the bug in the PR. Live demo preferred.

  - Add appropriate test coverage if applicable.

### Work Step Example

- Fork the repository from [Demivan/fluent-vue][#repo]
- Create your topic branch from `main`:

  ```shell
  git branch my-new-topic origin/main
  ```

- Write new code and relevant tests
- Run test and lint scripts
- Commit your changes: `git commit -am 'add feature X'`
- Push to the branch: `git push origin my-new-topic`
- Submit a pull request to `main` branch of `Demivan/fluent-vue` repository

## Development Setup

You will need [Node.js][#node] and [`yarn`][#yarn] and the code base is mainly written in [TypeScript][#ts]

After cloning the repo, run:

```shell
yarn install
```

### Commonly used NPM scripts

```shell
# watch and serve with hot reload examples
$ yarn start

# lint source codes
$ yarn lint

# run unit tests with Jest
$ yarn test

# build all dist files
$ yarn build
```

There are some other scripts available in the `scripts` section of the `package.json` file.

[#repo]: https://github.com/Demivan/fluent-vue
[#yarn]: https://yarnpkg.com/
[#node]: http://nodejs.org
[#ts]: https://www.typescriptlang.org/
