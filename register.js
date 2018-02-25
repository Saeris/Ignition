require(`@babel/register`)({
  ignore: [`src/**/__TEST__/*.spec.js`],
  only: [`src/**/*.js`]
})
require(`browser-env`)([`window`, `document`, `navigator`])
require(`@babel/polyfill`)
require(`isomorphic-fetch`)
