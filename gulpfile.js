/* eslint-disable @typescript-eslint/explicit-function-return-type */
const LinfraArbiter = require(`@linfra/arbiter`);
const _ = require(`lodash`);
const gulp = require(`gulp`);
const del = require(`del`);

async function prepareLinfraArbiter () {
  const arbiter = LinfraArbiter.LernaArbiter.create();
  await arbiter.setLernaRepositories([
    `.`,
  ]);
  return arbiter;
}

exports[`ext:linfra:build`] = async function prodLinfraBuild (done) {
  const arbiter = await prepareLinfraArbiter();

  await arbiter.buildLinfraModules({
    concurrencyConfig: {
      buildLevel: 2,
    },
    commandConfig: {
      buildCommand: 'npm run ext:build',
    },
  });
};

exports[`dev:linfra:build`] = async function linfraBuild (done) {
  const arbiter = await prepareLinfraArbiter();

  await arbiter.buildLinfraModules({
    concurrencyConfig: {
      buildLevel: 2,
    },
  });
};

const ChromeExtensionFolder = './packages/chrome-extension/dist';
const DevToolAppFolder = './packages/devtool-app/dist';
const DistFolder = './dist';

function getGlobPaths (folderPath) {
  return [
    `${folderPath}/**/*`,
    `${folderPath}/**/.*`,
  ];
}

const FoldersForMove = _.concat(
  getGlobPaths(ChromeExtensionFolder),
  getGlobPaths(DevToolAppFolder),
);

exports[`ext:clear`] = async function cleanDist () {
  const delResult = await del(`${DistFolder}/*`, { force: true });
  return delResult;
};

exports[`ext:move`] = function moveDist () {
  return gulp.src(FoldersForMove)
    .pipe(
      gulp.dest(DistFolder),
    );
};

exports[`ext:bundle`] = gulp.series(
  exports[`ext:clear`],
  exports[`ext:move`],
);
