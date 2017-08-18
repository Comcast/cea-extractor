
var webpack = require("webpack");
var CopyFiles = require("copy-webpack-plugin");

module.exports = {
    context: __dirname + "/",
    entry: "./worker",
    output: {
        path: __dirname + "/dist",
        filename: "worker.js"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            comments: false,
            compress: {
                warnings: false
            }
        }),
        new CopyFiles([{ from: "worker-custom.d.ts", to: "worker.d.ts" }])
    ]
};
