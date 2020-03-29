const path = require('path');

const outputConfig = {
    js: {
        ext: 'js',
        folder: 'javascripts'
    },
    scss: {
        ext: 'css',
        folder: 'stylesheets-as-js'
    }
}

module.exports = {
    entry: {
        demo: './src/js/test-script.js',
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
                 // Compiles Sass to CSS
                'sass-loader',
            ],
          },
        ],
    },


    output: {
        filename: chunkData => {
            let ext = chunkData.chunk.entryModule.rawRequest.substring(chunkData.chunk.entryModule.rawRequest.lastIndexOf('.')+1)
            console.log (ext)

            if (!outputConfig[ext]) {return `[name].${ext}`}

            return `${outputConfig[ext].folder}/[name].${outputConfig[ext].ext}`
        },
        path: path.resolve(__dirname, 'public/'),
    },
};