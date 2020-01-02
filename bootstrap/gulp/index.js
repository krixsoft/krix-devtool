const { GulpHelper } = require('../helpers');

const BuildGulp = require('./build.gulp');

module.exports = GulpHelper.combineGulpFiles(
  BuildGulp,
);
