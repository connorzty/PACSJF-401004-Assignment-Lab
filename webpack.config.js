// const path = require('path')

// module.exports = {
//    entry: path.join(__dirname, 'src/js', 'index.js'), // Our frontend will be inside the src folder
//    output: {
//       path: path.join(__dirname, 'dist'),
//       filename: 'build.js' // The final file will be created in dist/build.js
//    },
//    module: {
//       loaders: [{
//          test: /\.css$/, // To load the css in react
//          use: ['style-loader', 'css-loader'],
//          include: /src/
//       }, {
//          test: /\.jsx?$/, // To load the js and jsx files
//          loader: 'babel-loader',
//          exclude: /node_modules/,
//          options: {
//             presets: [ '@babel/preset-env', '@babel/preset-react']
//          }
//       }, {
//          test: /\.json$/, // To load the json files
//          loader: 'json-loader'
//       }]
//    }
// }

const path = require('path');

module.exports = {
  mode: 'development', // or 'production'
  entry: path.join(__dirname, 'src/js', 'index.js'), // Our frontend will be inside the src folder
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'build.js' // The final file will be created in dist/build.js
  },
  module: {
    rules: [
      {
        test: /\.css$/, // To load the css in react
        use: ['style-loader', 'css-loader'],
        include: /src/
      },
      {
        test: /\.jsx?$/, // To load the js and jsx files
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      },
      {
        test: /\.json$/, // To load the json files
        type: 'javascript/auto',
        use: 'json-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "url": require.resolve("url/"),
      "buffer": require.resolve("buffer/")
    }
  }
};
