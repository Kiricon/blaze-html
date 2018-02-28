
const path = require('path');
module.exports = {
    entry: "./main.ts",
    output: {
        path: path.join(__dirname),
        filename: "bundle.js"
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
        modules: [
            path.resolve('./node_modules'),
            path.resolve('./')
          ]
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, loader: "ts-loader" },
        ]
    },
    devServer: {
        contentBase: path.join(__dirname),
        compress: true,
        port: 3000
      },
    watch: true
}