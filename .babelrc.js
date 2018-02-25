const { join } = require(`path`) // eslint-disable-line
const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || (process.env.NODE_ENV = `development`)
const envDev = ENV === `development`
const envProd = ENV === `production`
const envTest = ENV === `test`
const rootDir = join(__dirname, ``)
const srcDir = join(__dirname, `src`)
const pubDir = join(__dirname, `public`)

module.exports = {
  sourceMaps: envTest ? `inline` : false,
  plugins: [
    envTest ? `babel-plugin-istanbul` : null,
    [`babel-plugin-react-css-modules`, {
      context: rootDir,
      exclude: `node_modules`,
      filetypes: { ".scss": { syntax: `postcss-scss` } },
      generateScopedName: `[local]_[hash:base64:5]`,
      webpackHotModuleReloading: envDev
    }],
    [`babel-plugin-provide-modules`, {
      "core-js/fn/promise": `Promise`,
      "preact": [`h`],
      "react": [`Component`, `React`],
      "regenerator-runtime": `regeneratorRuntime`,
      "prop-types": `PropTypes`
    }],
    envTest ? ["module-resolver", {
      "root": ["./src"],
      "alias": {
        // Application Aliases
        '@': srcDir,
        '@components': join(srcDir, `app/components`),
        '@models': join(srcDir, `app/models`),
        '@public': pubDir,
        '@routes': join(srcDir, `app/routes`),
        '@services': join(srcDir, `app/services`),
        // Module Aliases
        'react': `preact-compat-enzyme`,
        'react-dom': `preact-compat-enzyme`,
        'create-react-class': `preact-compat/lib/create-react-class`,
        'react-dom/server': `preact-render-to-string`,
        'react-dom/test-utils': `preact-test-utils`,
        'react-test-renderer/shallow': `preact-test-utils`,
        'react-test-renderer': `preact-test-utils`,
        'react-addons-test-utils': `preact-test-utils`,
        'react-addons-transition-group': `preact-transition-group`
      }
    }] : null,
    [`babel-plugin-webpack-alias`, { config: `./webpack.config.js` }],
    [`inline-replace-variables`, {
      ENV: { type: `node`, replacement: `process.env.NODE_ENV` }
    }],
    [`@babel/plugin-transform-react-jsx`, { pragma: `h` }],
    envProd ? [`@babel/transform-runtime`, {
      helpers: false,
      polyfill: false,
      regenerator: true
    }] : null
  ].filter(nonNull => nonNull),
  presets: [
    [`@babel/preset-env`, { modules: envTest && `commonjs`, useBuiltIns: `usage` }],
    `@babel/preset-stage-0`,
    `@babel/preset-flow`
  ].filter(nonNull => nonNull)
}
