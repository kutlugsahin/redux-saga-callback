const path = require('path');

const libPath = path.resolve(__dirname, '../', 'demo');
const outPath = path.resolve(__dirname, '../', 'demo', 'dist');

console.warn('============= reading webpack.lib.config.js ====================');

module.exports = {
    mode: 'development',
    entry: path.join(libPath, 'index.js'),
    output: {
        path: outPath,
        filename: 'index.js',
    },
    devtool: 'source-map',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: libPath,
                loader: 'babel-loader',
                options: {
                    configFile: path.resolve(__dirname, './babel.config.js'),
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts'],
    }
};