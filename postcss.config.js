module.exports = {
  parser: `postcss-scss`,
  plugins: [
    require(`postcss-preset-env`),
    require(`postcss-cssnext`),
    require(`postcss-flexbugs-fixes`),
    require(`postcss-sorting`),
    require(`postcss-normalize`)({ "force-import": true })
  ]
}
