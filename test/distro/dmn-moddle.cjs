const { expect } = require('chai');


describe('dmn-moddle', function() {

  it('should expose ESM bundle', async function() {
    const DmnModdle = await import('dmn-moddle').then(m => m.default);

    expect(new DmnModdle()).to.exist;
  });


  it('should export CJS bundle', function() {
    const DmnModdle = require('dmn-moddle');

    expect(new DmnModdle()).to.exist;
  });

});
