# install

Install npm dependencies to local disk

## Usage

```js
const install = require('@fofx/install');

async function main() {
  const manifests = await install('./install/here', [
    'lodash',
    'express@2',
    'mongoose',
  ]);
  // or, for a dry-run:
  const manifests2 = await install(
    './install/here',
    ['lodash', 'express@2', 'mongoose'],
    false
  );
}
```
