/* eslint-disable @typescript-eslint/explicit-function-return-type */
const gulp = require(`gulp`);

const distFolder = `./dist`;

const GulpCommon = require(`./gulp.common`);
const { GulpHelper } = require(`../../bootstrap/helpers/gulp.helper`);

module.exports = GulpHelper.combineGulpFiles(
  GulpCommon,
);
exports = module.exports;

exports[`build:move`] = function buildMoveTask () {
  return gulp.src([
    `./src/manifest.json`,
    `./src/devtools.html`,
  ])
    .pipe(
      gulp.dest(distFolder),
    );
};

exports[`build`] = gulp.series(
  exports[`build:move`],
);
