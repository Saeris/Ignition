import path from 'path'
//import util from 'util'
import { DefinePlugin, ProvidePlugin, LoaderOptionsPlugin, optimize } from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackPwaManifest from 'webpack-pwa-manifest'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin' // https://github.com/lodash/lodash-webpack-plugin
import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin'

const { CommonsChunkPlugin, UglifyJsPlugin } = optimize

const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || (process.env.NODE_ENV = `development`)
const title = `Ignition`
const name = `Ignition`
const description = ``
const baseURL = `/`
const bgColor = `#fff`
const themeColor = `#2c1e3f`
const srcDir = path.join(__dirname, `src`)
//const pubDir = path.join(__dirname, `public`)
const outDir = path.join(__dirname, `dist`)
const npmDir = path.join(__dirname, `node_modules`)

const isVendor = ({ resource }) => resource && resource.indexOf(npmDir) !== -1

const appCSS = new ExtractTextPlugin({
  filename: `[name]_[chunkhash].css`,
  allChunks: true
})

const vendorCSS = new ExtractTextPlugin({
  filename: `vendor_[chunkhash].css`,
  allChunks: true
})

const config = {
  entry: {
    vendor: [
      `font-awesome/scss/font-awesome.scss`,
      `bootstrap/scss/bootstrap-reboot.scss`,
      `history`,
      `prop-types`,
      `preact`,
      `preact-compat`,
      `react-apollo`,
      `react-redux`,
      `react-router`,
      `react-router-dom`,
      `react-router-redux`,
      `redux`,
      `redux-logger`
    ],
    polyfills: [
      `babel-polyfill`,
      `whatwg-fetch`
    ],
    app: [
      `preact/devtools`,
      `./src/app.js`
    ]
  },
  output: {
    path: outDir,
    publicPath: `/`,
    filename: `[name].[chunkhash].bundle.js`,
    sourceMapFilename: `[name].[chunkhash].bundle.map`,
    chunkFilename: `[id].[chunkhash].chunk.js`
  },
  stats: {
    colors: true,
    reasons: false,
    chunks: false
  },
  performance: {
    hints: false
  },
  resolve: {
    extensions: [`.js`, `.jsx`, `.json`, `.scss`, `.sass`, `.css`],
    alias: {
      react: `preact-compat/dist/preact-compat`,
      'react-dom': `preact-compat/dist/preact-compat`,
      'create-react-class': `preact-compat/lib/create-react-class`,
      'react-addons-css-transition-group': `preact-css-transition-group`
    },
    modules: [
      srcDir,
      npmDir
    ]
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: npmDir, loader: `babel-loader`, options: { forceEnv: ENV } },
      { test: /\.(css|scss|sass)$/, include: srcDir, use: appCSS.extract({
        fallback: `style-loader`, use: [
          { loader: `css-loader`, options: {
            modules: true,
            localIdentName: `[name]_[hash:base64:5]`,
            importLoaders: 3
          } },
          { loader: `postcss-loader` },
          { loader: `resolve-url-loader`},
          { loader: `sass-loader`, options: { precision: 8 } }
        ]
      })},
      { test: /\.(css|s[ac]ss)$/, exclude: srcDir,  use: vendorCSS.extract({
        fallback: `style-loader`, use: [
          { loader: `css-loader`, options: {
            modules: false,
            importLoaders: 3
          } },
          { loader: `postcss-loader` },
          { loader: `resolve-url-loader` },
          { loader: `sass-loader`, options: { precision: 8 } }
        ]
      })},
      //{ test: require.resolve(`jquery`), loader: `expose-loader?$!expose-loader?jQuery` },
      { test: /\.json$/, loader: `json-loader` },
      { test: /\.(graphql|gql)$/, exclude: npmDir, loader: `graphql-tag/loader` },
      { test: /\.(mp4|mov|ogg|webm)(\?.*)?$/i, loader: `url-loader` },
      { test: /\.(png|gif|jpg|cur)$/, loader: `url-loader`, query: { limit: 8192 } },
      { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: `url-loader`, query: { limit: 10000, mimetype: `application/font-woff2` } },
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: `url-loader`, query: { limit: 10000, mimetype: `application/font-woff` } },
      { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: `file-loader` },
      { test: /\src\/images$/, loader: `ignore-loader` }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `./public/index.ejs`,
      title,
      baseURL,
      serviceWorker: `/service-worker.js`,
      inject: false,
      chunksSortMode: `dependency`,
      minify: { removeComments: true, collapseWhitespace: true }
    }),
    new WebpackPwaManifest({
      name: title,
      short_name: name,
      description: description,
      background_color: bgColor,
      theme_color: themeColor,
      display: `standalone`,
      orientation: `portrait-primary`
    }),
    new SWPrecacheWebpackPlugin({
  		navigateFallback: `index.html`,
      filepath: `${outDir}/service-worker.js`,
  		minify: true,
  		staticFileGlobsIgnorePatterns: [
  			/polyfills(\..*)?\.js$/,
  			/\.map$/,
  			/asset-manifest\.json$/
  		]
  	}),
    new CopyWebpackPlugin([
      { from: `_redirects` },
      //{ from: `favicon.ico`, to: `favicon.ico` },
      { context: `src/img`, from: `**/*`, to: `img` }
    ]),
    new DefinePlugin({
      '__DEV__': false,
      'ENV': JSON.stringify(ENV),
      'HMR': false,
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'NODE_ENV': JSON.stringify(ENV),
        'HMR': false
      }
    }),
    new ProvidePlugin({
      React : `react`,
      h: [`preact`, `h`],
      Component: [`react`, `Component`],
      connect: [`react-redux`, `connect`],
      linkState: `linkstate`,
      debounce: [`decko`, `debounce`],
      memoize: [`decko`, `memoize`],
      PropTypes: `prop-types`,
      //$: `jquery`,
      //jQuery: `jquery`,
      //'window.jQuery': `jquery`,
      regeneratorRuntime: `regenerator-runtime`,
      Promise: `core-js/fn/promise`
    }),
    new LoaderOptionsPlugin({
      options: { htmlLoader: {
        minimize: true,
        removeAttributeQuotes: false,
        caseSensitive: true
      } }
    }),
    new LodashModuleReplacementPlugin(),
    appCSS,
    vendorCSS,
    new CommonsChunkPlugin({
      name: `polyfills`,
      chunks: [`polyfills`],
      minChunks: isVendor
    }),
    new CommonsChunkPlugin({
      name: `vendor`,
      chunks: [`app`, `vendor`],
      minChunks: isVendor
    }),
    new UglifyJsPlugin({
      beautify: false,
      comments: false,
      sourceMap: false,
      mangle: true,
      compress: {
        keep_fnames: false,
        unused: true,
        dead_code: true,
        warnings: false,
        screw_ie8: true,
        sequences: true,
        properties: true,
        drop_debugger: true,
        conditionals: true,
        comparisons: true,
        evaluate: true,
        booleans: true,
        loops: true,
        hoist_funs: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        side_effects: true,
        collapse_vars: true,
        reduce_vars: true
      }
    })
  ]
}

//console.log(util.inspect(config, {showHidden: false, depth: null}))

export default config
