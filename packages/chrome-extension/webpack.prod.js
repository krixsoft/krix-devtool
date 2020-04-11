const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const path = require('path');

module.exports = {
  entry: {
    background: `./src/background.ts`,
    contentscript: `./src/contentscript.ts`,
    devtools: `./src/devtools.ts`,
  },
  output: {
    path: path.resolve(__dirname, `./dist`),
    filename: `[name].bundle.js`,
  },
  // target: 'node',
  mode: `production`,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: `ts-loader`,
        exclude: /node_modules/,
        options: {
          configFile: `tsconfig.prod.json`,
        },
      },
      {
        enforce: `pre`,
        test: /\.tsx?$/,
        loader: `eslint-loader`,
        options: {
          configFile: `./.eslintrc.json`,
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ `.ts`, `.tsx`, `.js` ],
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
        },
      }),
    ],
  },
};
