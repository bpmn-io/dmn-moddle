import expect from '../../expect';

import {
  createModdle,
  readFile
} from '../../helper';


describe('dmn-moddle - read', function() {

  const moddle = createModdle();

  function read(xml, root, options, callback) {
    return moddle.fromXML(xml, root, options, callback);
  }

  function fromFile(file, root, options, callback) {
    const contents = readFile(file);

    return read(contents, root, options, callback);
  }


  describe('DMN', function() {

    it('Decision', function(done) {

      // when
      fromFile('test/fixtures/dmn/decision.part.dmn', 'dmn:Definitions', function(err, result) {

        const expected = {
          $type: 'dmn:Decision',
          id: 'Decision_1',
          name: 'Decision'
        };

        // then
        expect(err).not.to.exist;
        expect(result.drgElement[ 0 ]).to.jsonEqual(expected);

        done(err);
      });
    });


    it('InputData');

  });


  describe('DI', function() {

    it('Decision');


    it('InputData');

  });

});
