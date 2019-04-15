const devnull = require('dev-null');

const promisify = fn => (...args) =>
  new Promise((resolve, reject) =>
    fn(...args, (err, ...values) =>
      err ? reject(err) : resolve(values.length > 1 ? values : values[0])
    )
  );
const rimraf = promisify(require('rimraf'));
const mkdirp = promisify(require('mkdirp'));

function wrapByDevNull(fn) {
  const { stdout, stderr } = process;
  const dn = devnull();
  const writeToOut = stdout.write.bind(stdout);
  const writeToErr = stderr.write.bind(stderr);
  const writeToDevNull = dn.write.bind(dn);

  return async (...args) => {
    process.stdout.write = writeToDevNull;
    process.stderr.write = writeToDevNull;
    let error;
    let value;
    try {
      value = await fn(...args);
    } catch (err) {
      error = err;
    } finally {
      process.stdout.write = writeToOut;
      process.stderr.write = writeToErr;
    }
    if (error) {
      throw error;
    }
    return value;
  };
}

module.exports = {
  promisify,
  rimraf,
  mkdirp,
  wrapByDevNull,
};
