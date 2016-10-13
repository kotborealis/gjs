var path = require('path');
module.exports = {
    context: path.resolve("./src/"),
    entry: ['babel-polyfill', './main.js'],
    output: {
        path: "public",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: path.join(__dirname, 'src'),
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
            }
            }
        ]
    },
    devtool: 'source-map'
};
