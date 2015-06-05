'use strict';

var SchemaValidator = require('xsd-schema-validator');

var DMN_XSD = 'test/fixtures/xsd/dmn.xsd';

var Helper = require('./helper');


module.exports.fromFile = function(moddle, file, done) {
  var fileContents = Helper.readFile(file);

  moddle.fromXML(fileContents, 'dmn:Definitions', done);
};

module.exports.toXML = function(element, opts, done) {
  element.$model.toXML(element, opts, done);
};

module.exports.validate = function(err, xml, done) {

  if (err) {
    return done(err);
  }

  if (!xml) {
    return done(new Error('XML is not defined'));
  }

  SchemaValidator.validateXML(xml, DMN_XSD, function(err, result) {

    if (err) {
      return done(err);
    }

    expect(result.valid).to.be.true;
    done();
  });
};
