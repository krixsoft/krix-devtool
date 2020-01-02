/* eslint-disable @typescript-eslint/explicit-function-return-type */
const gulp = require(`gulp`);
const del = require(`del`);

const distFolder = `./dist`;

exports[`clean:dist`] = async function cleanDist () {
  const delResult = await del(`${distFolder}/*`, { force: true });
  return delResult;
};

exports[`build:move`] = function sharedMove () {
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
