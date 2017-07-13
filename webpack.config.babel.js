import path from 'path'
import webpack from 'webpack'
import { generateConfig, stripMetadata } from '@easy-webpack/core'
import envProd from '@easy-webpack/config-env-production'
import envDev from '@easy-webpack/config-env-development'
import babel from '@easy-webpack/config-babel'
import html from '@easy-webpack/config-html'
import css from '@easy-webpack/config-css'
import sass from '@easy-webpack/config-sass'
import fontAndImages from '@easy-webpack/config-fonts-and-images'
import globalBluebird from '@easy-webpack/config-global-bluebird'
import globalJquery from '@easy-webpack/config-global-jquery'
import globalRegenerator from '@easy-webpack/config-global-regenerator'
import generateIndexHtml from '@easy-webpack/config-generate-index-html'
import commonChunksOptimize from '@easy-webpack/config-common-chunks-simple'
import copyFiles from '@easy-webpack/config-copy-files'

const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || (process.env.NODE_ENV = `development`)
const title = `Ignition`
const port = process.env.PORT || 9000

const config = generateConfig({
  entry: {
    app: [
      `react-hot-loader/patch`,
      `webpack-dev-server/client?http://localhost:${port}/`,
      `webpack/hot/only-dev-server`,
      `./src/app.js`
    ],
    vendor: [
      `bluebird`,
      `history`,
      `jquery`,
      `prop-types`,
      `react`,
      `react-apollo`,
      `react-dom`,
      `react-redux`,
      `react-router`,
      `react-router-dom`,
      `react-router-redux`,
      `redux`,
      `redux-logger`,
      `regenerator-runtime`
    ]
  },
  output: {
    path: path.join(__dirname, `dist`),
    publicPath: `/`
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: false
  },
  resolve: {
    extensions: [`.js`, `.jsx`]
  },
  module: {
    rules: [
      { test: /\.(graphql|gql)$/, exclude: /node_modules/, loader: `graphql-tag/loader` },
      { test: /\.ai$/, loader: `ignore-loader` },
      { test: /\src\/images$/, loader: `ignore-loader` }
    ]
  },
  devServer: {
    historyApiFallback: true,
    hot: true
  },
  devtool: ENV === `production` ? `source-map` : `eval`,
  plugins: [
    new webpack.ProvidePlugin({
      React : `react`,
      Component: [`react`, `Component`],
      PropTypes: `prop-types`
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
},
ENV === `development` ? { performance: { hints: false } } : {},
ENV === `test` || ENV === `development`
  ? envDev(ENV !== `test` ? {} : {devtool: `inline-source-map`})
  : envProd(),
babel(),
html(),
css({ filename: `styles.css`, allChunks: true, sourceMap: false, additionalLoaders: [`postcss-loader`] }),
sass({ allChunks: true, sourceMap: false, additionalLoaders: [`postcss-loader`] }),
fontAndImages(),
globalBluebird(),
globalJquery(),
globalRegenerator(),
generateIndexHtml({minify: ENV === `production`, overrideOptions: { template: `./public/index.ejs`, title}}),
...(ENV === `production` || ENV === `development`
  ? [ commonChunksOptimize({appChunkName: `app`, firstChunk: `vendor`}),
    copyFiles({patterns: [
      { from: `_redirects` },
      //{ from: `favicon.ico`, to: `favicon.ico` },
      { context: `src/img`, from: `**/*`, to: `img` }
    ]})
  ]
  : [ /* ENV === 'test' */ ]),
ENV === `production`
  ? { plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        join_vars: true,
        if_return: true
      },
      output: {
        comments: false
      }
    })
  ]}
  : {},
)

export default stripMetadata(config)
