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


  describe('should import Decisions', function() {

    describe('dmn', function() {

      it('Decision', function(done) {

        // when
        fromFile('test/fixtures/dmn/decision.part.dmn', 'dmn:Definitions', function(err, result) {

          var expected = {
            $type: 'dmn:Decision',
            id: 'decision',
            name: 'decision-name'
          };

          // then
          expect(err).to.be.undefined;
          expect(result.decision[0]).to.jsonEqual(expected);

          done(err);
        });
      });
    });
  });
});
