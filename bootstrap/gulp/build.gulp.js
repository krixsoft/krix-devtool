/* eslint-disable @typescript-eslint/explicit-function-return-type */
const _ = require(`lodash`);
const gulp = require(`gulp`);
const del = require(`del`);

const { Config } = require(`../config`);

const FoldersForMove = _.concat(
  getGlobPaths(Config.Paths.ChromeExtension),
  getGlobPaths(Config.Paths.DevToolApp),
);

function getGlobPaths (folderPath) {
  return [
    `${folderPath}/**/*`,
    `${folderPath}/**/.*`,
  ];
}

exports[`build:clear`] = async function cleanDist () {
  const delResult = await del(`${Config.Paths.Dist}/*`, { force: true });
  return delResult;
};

exports[`build:move`] = function sharedMove () {
  return gulp.src(FoldersForMove)
    .pipe(
      gulp.dest(Config.Paths.Dist),
    );
};

exports[`build`] = gulp.series(
  exports[`build:clear`],
  exports[`build:move`],
);

exports[`build:move:watch`] = function sharedMoveWatch () {
  return gulp.watch(FoldersForMove, gulp.series(exports[`build`]));
};

exports[`build:watch`] = gulp.series(
  exports[`build`],
  exports[`build:move:watch`],
);
