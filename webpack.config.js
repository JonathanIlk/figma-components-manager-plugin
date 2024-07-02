const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

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
                    test: /\.tsx?$/,
                    loader: "ts-loader"
                }
            ]
        },
        plugins: [new HtmlWebpackPlugin({
            template: './frontend/ui.html',
            filename: 'ui.html',
            cache: false, // disable cache otherwise the script will not be inlined freshly when the typescript changes during watch
        }),
        new HtmlInlineScriptPlugin()
        ],
    }
];