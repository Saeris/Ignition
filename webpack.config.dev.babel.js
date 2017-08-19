import path from 'path'
//import util from 'util'
import { DefinePlugin, ProvidePlugin, HotModuleReplacementPlugin, NamedModulesPlugin, NoEmitOnErrorsPlugin, optimize } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackPwaManifest from 'webpack-pwa-manifest'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin' // https://github.com/lodash/lodash-webpack-plugin
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

const { ModuleConcatenationPlugin, CommonsChunkPlugin, UglifyJsPlugin } = optimize

const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || (process.env.NODE_ENV = `development`)
const title = `Ignition`
const name = `Ignition`
const description = ``
const baseURL = `/`
const bgColor = `#fff`
const themeColor = `#2c1e3f`
const host = process.env.HOST || `localhost`
const port = process.env.PORT || 9000
const srcDir = path.join(__dirname, `src`)
//const pubDir = path.join(__dirname, `public`)
const outDir = path.join(__dirname, `dist`)
const npmDir = path.join(__dirname, `node_modules`)

const isVendor = ({ resource }) => resource && resource.indexOf(npmDir) !== -1

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
      `react-hot-loader/patch`,
      `webpack-dev-server/client?http://${host}:${port}/`,
      `webpack/hot/only-dev-server`,
      `preact/devtools`,
      `./src/app.js`
    ]
  },
  output: {
    path: outDir,
    publicPath: `/`,
    filename: `[name].bundle.js`,
    sourceMapFilename: `[name].bundle.map`,
    chunkFilename: `[id].chunk.js`
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
      { test: /\.(css|scss|sass)$/, include: srcDir, use: [
        { loader: `style-loader`, options: { sourceMap: true } },
        { loader: `css-loader`, options: {
          modules: true,
          sourceMap: true,
          localIdentName: `[name]_[hash:base64:5]`,
          importLoaders: 3
        } },
        { loader: `postcss-loader`, options: { sourceMap: true } },
        { loader: `resolve-url-loader`, options: {sourceMap: true } },
        { loader: `sass-loader`, options: { sourceMap: true, precision: 8 } }
      ]},
      { test: /\.(css|s[ac]ss)$/, exclude: srcDir,  use: [
        { loader: `style-loader`, options: { sourceMap: true } },
        { loader: `css-loader`, options: {
          modules: false,
          sourceMap: true,
          importLoaders: 3
        } },
        { loader: `postcss-loader`, options: { sourceMap: true } },
        { loader: `resolve-url-loader`, options: {sourceMap: true } },
        { loader: `sass-loader`, options: { sourceMap: true, precision: 8 } }
      ]},
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
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: port,
    host: host,
    compress: true,
    inline: true,
    watchContentBase: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    stats: {
      colors: true,
      chunks: false
    }
  },
  devtool: `source-map`,
  plugins: [
    new HtmlWebpackPlugin({
      template: `./public/index.ejs`,
      title,
      baseURL,
      serviceWorker: null,
      inject: false,
      chunksSortMode: `dependency`
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
    new CopyWebpackPlugin([
      { from: `_redirects` },
      //{ from: `favicon.ico`, to: `favicon.ico` },
      { context: `src/img`, from: `**/*`, to: `img` }
    ]),
    new DefinePlugin({
      '__DEV__': true,
      'ENV': JSON.stringify(ENV),
      'HMR': true,
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'NODE_ENV': JSON.stringify(ENV),
        'HMR': true,
        'WEBPACK_HOST': JSON.stringify(host),
        'WEBPACK_PORT': JSON.stringify(port)
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
    new LodashModuleReplacementPlugin(),
    new ModuleConcatenationPlugin(),
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
    new HotModuleReplacementPlugin(),
    new NamedModulesPlugin(),
    new NoEmitOnErrorsPlugin(),
    new UglifyJsPlugin({
      beautify: true,
      comments: true,
      sourceMap: true,
      mangle: false,
      compress: {
        keep_fnames: true,
        unused: true,
        dead_code: true,
        warnings: false,
        screw_ie8: true,
        sequences: false,
        properties: false,
        drop_debugger: false,
        conditionals: false,
        comparisons: false,
        evaluate: false,
        booleans: false,
        loops: false,
        hoist_funs: false,
        if_return: false,
        join_vars: false,
        cascade: false,
        side_effects: false,
        collapse_vars: false,
        reduce_vars: false
      }
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: `server`,
      analyzerPort: 8888,
      defaultSizes: `parsed`,
      openAnalyzer: false
    })
  ]
}

//console.log(util.inspect(config, {showHidden: false, depth: null}))

export default config
