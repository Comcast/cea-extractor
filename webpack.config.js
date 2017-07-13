
var webpack = require("webpack");

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
            },
        })
    ]
};
