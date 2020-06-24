var nodeExternals = require('webpack-node-externals')

module.exports = baseWebpackConfig

function baseWebpackConfig(clientOrServer) {
  var entryPoint, filename
  if (clientOrServer == 'server') {
    entryPoint = './src/bin/server.ts'
    filename = 'txr-server'
  } else if (clientOrServer == 'library') {
    entryPoint = './src/bin/client-library.ts'
    filename = 'txr-library.js'
  } else {
    entryPoint = './src/bin/client-cli.ts'
    filename = 'txr-client'
  }

  return {
    mode: 'production',
    entry: [entryPoint],
    target: 'node',
    output: {
      filename: filename,
    },
    externals: [nodeExternals()],
    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },
    module: {
      rules: [
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        { test: /\.tsx?$/, loader: 'ts-loader' },
      ],
    },
  }
}
