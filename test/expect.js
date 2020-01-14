import chai from 'chai';

chai.use(function(chai, utils) {
  utils.addMethod(chai.Assertion.prototype, 'jsonEqual', function(comparison) {
    const actual = JSON.stringify(this._obj);
    const expected = JSON.stringify(comparison);

    this.assert(
      actual == expected,
      'expected #{this} to deeply equal #{act}',
      'expected #{this} not to deeply equal #{act}',
      comparison,
      this._obj,
      true
    );
  });
});

export { expect as default } from 'chai';