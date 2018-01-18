var nodeExternals = require('webpack-node-externals')

module.exports = baseWebpackConfig

function baseWebpackConfig(clientOrServer) {
  let entryPoint, filename
  if (clientOrServer == 'server') {
    entryPoint = './src/server/index.js'
    filename = 'txr-server.js'
  } else {
    entryPoint = './src/client/index.js'
    filename = 'txr-client.js'
  }

  return {
    entry: [ 'babel-polyfill', entryPoint ],
    target: 'node',
    output: {
      filename: filename,
    },
    externals: [ nodeExternals() ],
    module: {
      loaders: [{
        test: /^.+\.js$/,
        loader: 'babel-loader'
      }]
    }
  }
}
