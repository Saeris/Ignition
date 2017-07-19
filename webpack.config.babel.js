import path from 'path'
import { DefinePlugin, ProvidePlugin, LoaderOptionsPlugin, HotModuleReplacementPlugin, NamedModulesPlugin, NoEmitOnErrorsPlugin, optimize } from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin' // https://github.com/lodash/lodash-webpack-plugin
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

const { ModuleConcatenationPlugin, CommonsChunkPlugin, UglifyJsPlugin } = optimize

const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || (process.env.NODE_ENV = `development`)
const envDev = ENV === `development`
const envProd = ENV === `production`
const envTest = ENV === `test`
const title = `Ignition`
const baseURL = `/`
const host = process.env.HOST || `localhost`
const port = process.env.PORT || 9000
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

export default ({
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
      ...(envDev ? [
        `react-hot-loader/patch`,
        `webpack-dev-server/client?http://${host}:${port}/`,
        `webpack/hot/only-dev-server`
      ] : []),
      `./src/app.js`
    ]
  },
  output: {
    path: outDir,
    publicPath: `/`,
    filename: envProd ? `[name].[chunkhash].bundle.js` : `[name].bundle.js`,
    sourceMapFilename: envProd ? `[name].[chunkhash].bundle.map` : `[name].bundle.map`,
    chunkFilename: envProd ? `[id].[chunkhash].chunk.js` : `[id].chunk.js`
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: false
  },
  performance: {
    hints: envProd
  },
  resolve: {
    extensions: [`.js`, `.jsx`],
    alias: {
      react: `preact-compat/dist/preact-compat`,
      'react-dom': `preact-compat/dist/preact-compat`,
      'create-react-class': `preact-compat/lib/create-react-class`
    },
    modules: [
      srcDir,
      npmDir
    ]
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: npmDir, loader: `babel-loader` },
      { test: /\.(css|scss|sass)$/, include: srcDir, use: appCSS.extract({
        fallback: `style-loader`, use: [
          { loader: `css-loader`, options: {
            modules: true,
            sourceMap: envDev,
            localIdentName: `[name]_[hash:base64:5]`,
            importLoaders: 3
          } },
          { loader: `postcss-loader`, options: { sourceMap: envDev } },
          { loader: `resolve-url-loader`, options: {sourceMap: envDev } },
          { loader: `sass-loader`, options: { sourceMap: true, precision: 8 } }
        ]
      })},
      { test: /\.(css|scss|sass)$/, exclude: srcDir,  use: vendorCSS.extract({
        fallback: `style-loader`, use: [
          { loader: `css-loader`, options: {
            modules: false,
            sourceMap: envDev,
            importLoaders: 3
          } },
          { loader: `postcss-loader`, options: { sourceMap: envDev } },
          { loader: `resolve-url-loader`, options: {sourceMap: envDev } },
          { loader: `sass-loader`, options: { sourceMap: true, precision: 8 } }
        ]
      })},
      //{ test: require.resolve(`jquery`), loader: `expose-loader?$!expose-loader?jQuery` },
      { test: /\.(graphql|gql)$/, exclude: npmDir, loader: `graphql-tag/loader` },
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
  devtool: envTest ? `inline-source-map` : `hidden-source-map`,
  plugins: [
    new HtmlWebpackPlugin({
      template: `./public/index.ejs`,
      title,
      baseURL,
      inject: false,
      chunksSortMode: `dependency`,
      minify: envProd ? {
        removeComments: true,
        collapseWhitespace: true
      } : undefined
    }),
    new CopyWebpackPlugin([
      { from: `_redirects` },
      //{ from: `favicon.ico`, to: `favicon.ico` },
      { context: `src/img`, from: `**/*`, to: `img` }
    ]),
    new DefinePlugin({
      '__DEV__': !envProd,
      'ENV': JSON.stringify(ENV),
      'HMR': true,
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'NODE_ENV': JSON.stringify(ENV),
        'HMR': true,
        ...(!envProd ? {
          'WEBPACK_HOST': JSON.stringify(host),
          'WEBPACK_PORT': JSON.stringify(port)
        } : {})
      }
    }),
    new ProvidePlugin({
      React : `react`,
      Component: [`react`, `Component`],
      connect: [`react-redux`, `connect`],
      PropTypes: `prop-types`,
      //$: `jquery`,
      //jQuery: `jquery`,
      //'window.jQuery': `jquery`,
      regeneratorRuntime: `regenerator-runtime`,
      Promise: `core-js/fn/promise`
    }),
    (envProd ? new LoaderOptionsPlugin({
      options: { htmlLoader: {
        minimize: true,
        removeAttributeQuotes: false,
        caseSensitive: true
      } }
    }) : null),
    new LodashModuleReplacementPlugin(),
    appCSS,
    vendorCSS,
    new ModuleConcatenationPlugin(),
    new CommonsChunkPlugin({
      name: `common`,
      minChunks: (module, count) => count >= 2 && !isVendor(module)
    }),
    new CommonsChunkPlugin({
      name: `polyfills`,
      chunks: [`polyfills`],
      minChunks: isVendor
    }),
    new CommonsChunkPlugin({
      name: `vendor`,
      chunks: [`app`, `vendor`, `polyfills`],
      minChunks: (module, count) => count >= 2 && isVendor(module)
    }),
    (envDev ? new HotModuleReplacementPlugin() : null),
    new NamedModulesPlugin(),
    new NoEmitOnErrorsPlugin(),
    new UglifyJsPlugin({
      beautify: envDev,
      comments: envDev,
      mangle: envProd,
      compress: {
        keep_fnames: envDev,
        unused: true,
        dead_code: true,
        warnings: false,
        screw_ie8: true,
        sequences: envProd,
        properties: envProd,
        drop_debugger: envProd,
        conditionals: envProd,
        comparisons: envProd,
        evaluate: envProd,
        booleans: envProd,
        loops: envProd,
        hoist_funs: envProd,
        if_return: envProd,
        join_vars: envProd,
        cascade: envProd,
        side_effects: envProd,
        collapse_vars: envProd,
        reduce_vars: envProd
      }
    }),
    (envDev ? new BundleAnalyzerPlugin({
      analyzerMode: `server`,
      analyzerPort: 8888,
      defaultSizes: `parsed`,
      openAnalyzer: false
    }) : null)
  ].filter(nonNull => nonNull)
})
