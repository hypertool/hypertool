# Hypertool Common

The Hypertool Common package contains type declarations, Mongoose models,
utilities, and other constructs that are used by all the other packages.

## Installation

The `@hypertool/common` package can be installed using NPM and Yarn. The `mongoose` package is a peer dependency.

```
yarn add @hypertool/common mongoose
```

If you using `@hypertool/common` as a dependency in a Hypertool package,
you should use yarn workspaces to install the package.

```
yarn workspace <package-name> add @hypertool/common
```

## License

The open-source components of Hypertool are available under the
[MIT license](https://opensource.org/licenses/MIT).
