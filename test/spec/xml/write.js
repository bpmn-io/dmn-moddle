import expect from '../../expect';

import { createModdle } from '../../helper';


describe('dmn-moddle - write', function() {

  const moddle = createModdle();

  function write(element, options, callback) {
    moddle.toXML(element, options, callback);
  }


  describe('dmn', function() {

    it('Definitions', function(done) {

      // given
      const definitions = moddle.create('dmn:Definitions');

      const expected = '<dmn:definitions xmlns:dmn="https://www.omg.org/spec/DMN/20191111/MODEL/" />';

      // when
      write(definitions, { preamble: false }, function(err, result) {

        // then
        expect(result).to.eql(expected);

        done(err);
      });

    });


    it('LiteralExpression', function(done) {

      // given
      const informationItem = moddle.create('dmn:InformationItem', {
        id: 'InformationItem_1',
        name: 'Bar',
        typeRef: 'integer'
      });

      const literalExpression = moddle.create('dmn:LiteralExpression', {
        id: 'LiteralExpression_1'
      });

      const decision = moddle.create('dmn:Decision', {
        id: 'Decision_1',
        literalExpression: literalExpression,
        name: 'Foo',
        variable: informationItem
      });

      const expected =
        '<dmn:decision xmlns:dmn="https://www.omg.org/spec/DMN/20191111/MODEL/" id="Decision_1" name="Foo">' +
        '<dmn:variable id="InformationItem_1" name="Bar" typeRef="integer" />' +
        '<dmn:literalExpression id="LiteralExpression_1" />' +
        '</dmn:decision>';

      // when
      write(decision, { preamble: false }, function(err, result) {

        // then
        expect(result).to.eql(expected);

        done(err);
      });
    });

  });


  describe('di', function() {

    it('Decision');


    it('InputData');

  });

});