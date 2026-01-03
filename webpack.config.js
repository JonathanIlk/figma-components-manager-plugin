const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = [
    {
        mode: "development",
        devtool: "inline-source-map",
        entry: {
            main: "./backend/backend.ts",
        },
        output: {
            path: path.resolve(__dirname, './build'),
            filename: "backend-bundle.js" // <--- Will be compiled to this single file
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader"
                }
            ]
        }
    },
    {
        mode: "development",
        devtool: "inline-source-map",
        entry: {
            main: "./frontend/frontend.ts",
        },
        output: {
            path: path.resolve(__dirname, './build'),
            filename: "frontend-bundle.js" // <--- Will be compiled to this single file
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                },
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                    }
                },
                { // Include styles in html file directly when they are imported in typescript (https://stackoverflow.com/a/53657486/1123709)
                    test: /\.scss$/,
                    use: [
                        {
                            loader: 'style-loader',
                            options: {
                                insert: 'head', // insert style tag inside of <head>
                                injectType: 'singletonStyleTag' // this is for wrap all your style in just one style tag
                            },
                        },
                        "css-loader",
                        "sass-loader"
                    ],
                }
            ]
        },
        plugins: [new HtmlWebpackPlugin({
            template: './frontend/ui.html',
            filename: 'ui.html',
            cache: false, // disable cache otherwise the script will not be inlined freshly when the typescript changes during watch
        }),
        new HtmlInlineScriptPlugin(),
        new VueLoaderPlugin()
        ],
    }
];