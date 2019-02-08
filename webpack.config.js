var nodeExternals = require('webpack-node-externals')

module.exports = baseWebpackConfig

function baseWebpackConfig(clientOrServer) {
  var entryPoint, filename
  if (clientOrServer == 'server') {
    entryPoint = './src/bin/server.js'
    filename = 'txr-server'
  } else if (clientOrServer == 'library') {
    entryPoint = './src/bin/client-library.js'
    filename = 'txr-library.js'
  } else {
    entryPoint = './src/bin/client-cli.js'
    filename = 'txr-client'
  }

  return {
    mode: 'production',
    entry: [ entryPoint ],
    target: 'node',
    output: {
      filename: filename,
    },
    externals: [ nodeExternals() ],
    module: {
      rules: [{
        test: /^.+\.js$/,
        loader: 'babel-loader'
      }]
    }
  }
}
