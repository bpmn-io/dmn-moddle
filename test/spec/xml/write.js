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
        '<dmn:definitions xmlns:dmn="http://www.omg.org/spec/DMN/20151101/dmn.xsd" />';

        // when
        write(definitions, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });

      });


      it('Literal Expression (empty)', function(done) {

        // given
        var variable = moddle.create('dmn:InformationItem', {
              typeRef: 'integer',
              id: 'temperature_ii',
              name: 'Weather in Celsius'
            }),
            literalExpression = moddle.create('dmn:LiteralExpression', {
              id: 'LiteralExpression_0y0an4b'
            }),
            decision = moddle.create('dmn:Decision', {
              name: 'Weather',
              id: 'weather_id',
              variable: variable,
              literalExpression: literalExpression
            });

        var expectedXML = [
          '<dmn:decision xmlns:dmn="http://www.omg.org/spec/DMN/20151101/dmn.xsd" id="weather_id" name="Weather">',
          '<dmn:variable id="temperature_ii" name="Weather in Celsius" typeRef="integer" />',
          '<dmn:literalExpression id="LiteralExpression_0y0an4b" />',
          '</dmn:decision>'
        ].join('');

        // when
        write(decision, function(err, result) {
          if (err) {
            return done(err);
          }

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });
    });

    describe('camunda', function() {

      it('inputVariable', function(done) {

        // given
        var definitions = moddle.create('dmn:InputClause', {
          inputVariable: 'foobar'
        });

        var expectedXML = [
          '<dmn:inputClause xmlns:dmn="http://www.omg.org/spec/DMN/20151101/dmn.xsd"',
          'xmlns:camunda="http://camunda.org/schema/1.0/dmn"',
          'camunda:inputVariable="foobar" />'
        ].join(' ');

        // when
        write(definitions, function(err, result) {
          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });

    });


    describe('di', function() {

      it('input data', function(done) {

        // given
        var bounds = moddle.create('biodi:Bounds', {
              x: 450,
              y: 270,
              width: 125,
              height: 45
            }),
            variable = moddle.create('dmn:InformationItem', {
              typeRef: 'integer',
              id: 'temperature_ii',
              name: 'Weather in Celsius'
            }),
            extensionElements = moddle.create('dmn:ExtensionElements', {
              values: [ bounds ]
            }),
            inputData = moddle.create('dmn:InputData', {
              name: 'Weather in Celsius',
              id: 'temperature_id',
              variable: variable,
              extensionElements: extensionElements
            });

        var expectedXML = [
          '<dmn:inputData xmlns:dmn=\"http://www.omg.org/spec/DMN/20151101/dmn.xsd\"' +
          ' xmlns:biodi="http://bpmn.io/schema/dmn/biodi/1.0" id="temperature_id" name="Weather in Celsius">',
          '<dmn:extensionElements>',
          '<biodi:bounds x="450" y="270" width="125" height="45" />',
          '</dmn:extensionElements>',
          '<dmn:variable id="temperature_ii" name="Weather in Celsius" typeRef="integer" />',
          '</dmn:inputData>'
        ].join('');

        // when
        write(inputData, function(err, result) {
          if (err) {
            return done(err);
          }

          // then
          expect(err).not.exist;
          expect(result).to.eql(expectedXML);

          done(null);
        });

      });

    });

  });

});
