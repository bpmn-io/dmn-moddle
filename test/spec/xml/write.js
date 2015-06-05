'use strict';

var assign = require('lodash/object/assign'),
    isFunction = require('lodash/lang/isFunction');

var Helper = require('../../helper');



describe('dmn-moddle - write', function() {

  var moddle = Helper.createModdle();


  function write(element, options, callback) {
    if (isFunction(options)) {
      callback = options;
      options = {};
    }

    // skip preamble for tests
    options = assign({ preamble: false }, options);

    moddle.toXML(element, options, callback);
  }



  describe('should export types', function() {

    describe('dmn', function() {

      it('Definitions (empty)', function(done) {

        // given
        var definitions = moddle.create('dmn:Definitions');

        var expectedXML =
          '<dmn:Definitions xmlns:dmn="http://www.omg.org/spec/DMN/20130901" />';

        // when
        write(definitions, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });

    });

  });

});
