var nodeExternals = require('webpack-node-externals')

module.exports = baseWebpackConfig

function baseWebpackConfig(clientOrServer) {
  var entryPoint, filename
  if (clientOrServer == 'server') {
    entryPoint = './src/bin/server.js'
    filename = 'txr-server.js'
  } else if (clientOrServer == 'library') {
    entryPoint = './src/bin/client-library.js'
    filename = 'txr-library.js'
  } else {
    entryPoint = './src/bin/client-cli.js'
    filename = 'txr-client.js'
  }

  return {
    // entry: [ 'babel-polyfill', entryPoint ],
    entry: [ entryPoint ],
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
