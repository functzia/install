const path = require('path');
const { mkdirp, wrapByDevNull } = require('./utils');
const { getManifests, installModulesInto } = require('./npm');

module.exports = wrapByDevNull(async (modulesDir, packages, install = true) => {
  await mkdirp(path.join(modulesDir, 'cache'));
  const [manifests] = await Promise.all([
    getManifests(packages, path.join(modulesDir, 'cache')),
    install
      ? await installModulesInto(path.join(modulesDir), packages)
      : Promise.resolve(),
  ]);
  return manifests;
});
