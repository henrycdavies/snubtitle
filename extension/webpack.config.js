
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'index.js',
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                exclude: /node_module/,
                use: 'ts-loader',
            }
        ]
    },
    resolve: {
        extensions: [
            '.ts',
            '.js',
        ]
    },
    mode: 'development',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './src/index.html',
                    to: './',
                }
            ]
        })
    ]
}
