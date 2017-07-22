module.exports = wallaby => ({
  files: [{ pattern: `src/**/*.js`, load: false }, { pattern: `src/**/*.spec.js`, ignore: true }],
  tests: [`src/**/*.spec.js`],
  testFramework: `ava`,

  env: {
    type: `node`,
    runner: `node`,
    params: {
      // Specify Environment Variables Here
    }
  },

  debug: true,

  compilers: {
    "src/**/*.js": wallaby.compilers.babel({
      presets: [`es2015`],
      plugins: [
        require(`babel-plugin-espower/create`)(require(`babel-core`), {
          embedAst: true,
          patterns: require(`ava/lib/enhance-assert`).PATTERNS
        })
      ],
      babelrc: true
    })
  }
})
