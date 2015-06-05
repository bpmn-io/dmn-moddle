'use strict';

var Helper = require('../../helper');


describe('dmn-moddle - read', function() {

  var moddle = Helper.createModdle();

  function read(xml, root, opts, callback) {
    return moddle.fromXML(xml, root, opts, callback);
  }

  function fromFile(file, root, opts, callback) {
    var contents = Helper.readFile(file);
    return read(contents, root, opts, callback);
  }


  describe('should import types', function() {

    describe('dmn', function() {

      it('ItemDefinition', function(done) {

        // given

        // when
        fromFile('test/fixtures/dmn/item-definition.part.dmn', 'dmn:ItemDefinition', function(err, result) {

          var expected = {
            $type: 'dmn:ItemDefinition',
            id: 'item2',
            name: 'OrderSumType',
            typeDefinition: 'number'
          };

          // then
          expect(result).to.jsonEqual(expected);

          done(err);
        });
      });
    });
  });
});
