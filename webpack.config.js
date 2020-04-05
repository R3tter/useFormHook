const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts'],
        alias: {
            utils: path.resolve(__dirname, 'src/utils/')
        }
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'library-name',
        libraryTarget: 'umd'
    },
    optimization: {
        minimize: true
    }
};
