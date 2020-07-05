const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: {
        base: './src/scss/base.scss',
        game: './src/scss/game.scss',
        sheets: './src/scss/sheets.scss',
        homepage: './src/js/homepage.js',
        gamepage: './src/js/gamepage.js',
        sheetspage: './src/js/sheetspage.js',
    },

    module: {
        rules: [
            { test: /\.vue$/, use: 'vue-loader' },
            { test: /\.css$/, use: ['vue-style-loader', 'css-loader']},
            { test: /\.js$/i, exclude: /node_modules/, },
            { test: /\.s[ac]ss$/i, exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'stylesheets/[name].css'
                        }
                    },
                    'sass-loader',
                ],
            },
        ],
    },

    plugins: [
        new VueLoaderPlugin(),
    ],

    output: {
        filename: `javascripts/[name].js`,
        path: path.resolve(__dirname, 'public/'),
    },
};