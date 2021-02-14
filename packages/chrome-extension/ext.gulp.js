/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unsafe-call */
const gulp = require(`gulp`);
const LinfraCore = require(`@linfra/core`);

const GulpCommon = require(`./common.gulp`);

module.exports = LinfraCore.Helpers.GulpHelper.combineGulpFiles(
  GulpCommon,
);
exports = module.exports;

const distFolder = `./dist`;

exports[`ext:copy-non-js-files`] = function extCopyNonJSFiles () {
  return gulp.src([
    `./src/manifest.json`,
    `./src/devtools.html`,
  ])
    .pipe(
      gulp.dest(distFolder),
    );
};
