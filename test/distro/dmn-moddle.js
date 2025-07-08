import { createRequire } from 'node:module';

import { expect } from 'chai';

import pkg from '../../package.json' with { type: 'json' };

const pkgExports = pkg.exports['.'];

describe('dmn-moddle', function() {

  it('should expose ESM bundle', async function() {
    const DmnModdle = await import('../../' + pkgExports.import).then(m => m.default);

    expect(new DmnModdle()).to.exist;
  });

  it('should export CJS bundle', function() {
    const require = createRequire(import.meta.url);

    const DmnModdle = require('../../' + pkgExports.require);

    expect(new DmnModdle()).to.exist;
  });
});
