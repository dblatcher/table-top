const path = require('path');

module.exports = {
    entry: {
        socket: './src/js/socket.js',
        base: './src/scss/base.scss'
    },


    module: {
        rules: [
          {
            test: /\.js$/i,
            exclude: /node_modules/,
          },
          {
            test: /\.s[ac]ss$/i,
            exclude: /node_modules/,
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


    output: {
        filename: `javascripts/[name].js`,
        path: path.resolve(__dirname, 'public/'),
    },
};