# COVID-19 app run guide

Make sure `npm` is installed on your computer.

Notice that in `index.html` no script tags or link:css tags are present, these will all be handled by webpack when you run one of the following commands. Webpack will transpile js to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments and it will link modules together so that we don't need to worry about which script tag comes first.

### Installing dependancies

run this at the beginning to install required dependencies.

```
  npm install
```

## Development

```
  npm run watch
```

Will spin up a development server that implements hot reloading whenever a file change is detected.

## Testing

```
  npm run test
```

Would run all the tests. Tests are recognized by having a name of the format `[FILE_NAME].test.js`

You can als use the watch mode to interactively keep running the tests while coding to make them pass.

```
  npm run test:watch
```

## lint

```
  npm run lint
```

This will scan the code for any violation of any code conventions (checkstyle is here again)

#### Bonus

If you're using vscode you can install extensions for `prettier` and `eslint` which would integrate those warnings into your development environment and if you want fix some on save for you.

## Production build

```
  npm run build
```

This would run the tests, if all pass it will run the linter and if no errors create a directory `dist/` with all the files in it. js is uglified and css is minified (for optimization reasons) it will also get all the assets used and change the imports so that `dist` would effectively be what we deploy (when we want to)
