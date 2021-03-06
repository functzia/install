const path = require('path');
const pacote = require('pacote');
const npm = require('npm/lib/npm.js');
const npmInstall = require('npm/lib/install.js');
const { rimraf, promisify } = require('./utils');

async function getManifests(specs, cacheDir) {
  await rimraf(cacheDir);
  return Promise.all(
    specs.map(spec => pacote.manifest(spec, { cache: cacheDir }))
  );
}

async function installSpecs(dir, pluginList) {
  await promisify(npm.load)({
    loglevel: 'silent',
    progress: false,
    silent: true,
  });
  return new Promise((resolve, reject) => {
    npmInstall(dir, pluginList, (err, result) =>
      err ? reject(err) : resolve(result)
    );
  });
}

async function installModulesInto(dir, specs) {
  await rimraf(path.join(dir, 'node_modules'));
  await rimraf(path.join(dir, 'package-lock.json'));
  return installSpecs(dir, specs);
}

module.exports = {
  getManifests,
  installModulesInto,
};
