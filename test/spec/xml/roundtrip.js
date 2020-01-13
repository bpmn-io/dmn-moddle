import {
  createModdle
} from '../../helper';

import {
  fromFile,
  toXML,
  validate
} from '../../xml-helper';


describe('dmn-moddle - roundtrip', function() {

  this.timeout(30000);

  const moddle = createModdle();


  describe('DMN', function() {

    it('Decision', function(done) {

      // given
      fromFile(moddle, 'test/fixtures/dmn/example.dmn', function(err, result) {

        // when
        toXML(result, { format: true }, function(err, xml) {

          validate(err, xml, done);
        });

      });

    });


    it('InputData');

  });


  describe('DI', function() {

    it('Decision');


    it('InputData');

  });

});
