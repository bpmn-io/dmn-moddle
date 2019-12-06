const {
  expect
} = require('chai');


describe('dmn-moddle', function() {

  it('should expose CJS bundle', function() {
    const DmnModdle = require('../../dist');

    expect(new DmnModdle()).to.exist;
  });


  it('should expose UMD bundle', function() {
    const DmnModdle = require('../../dist/dmn-moddle.umd.prod');

    expect(new DmnModdle()).to.exist;
  });

});