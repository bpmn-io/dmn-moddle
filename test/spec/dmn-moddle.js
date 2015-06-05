'use strict';

var Helper = require('../helper');

var moddle = Helper.createModdle();


describe('dmn-moddle', function() {


  describe('parsing', function() {

    it('should publish type', function() {
      // when
      var type = moddle.getType('dmn:Decision');

      // then
      expect(type).to.exist;
      expect(type.$descriptor).to.exist;
    });

  });

  describe('creation', function() {

    it('should create DMNElement', function() {
      var sequenceFlow = moddle.create('dmn:DMNElement');

      expect(sequenceFlow.$type).to.eql('dmn:DMNElement');
    });


    it('should create Definitions', function() {
      var definitions = moddle.create('dmn:Definitions');

      expect(definitions.$type).to.eql('dmn:Definitions');
    });


    it('should create Decision', function() {
      var process = moddle.create('dmn:Decision');

      expect(process.$type).to.eql('dmn:Decision');
      expect(process.$instanceOf('dmn:DRGElement')).to.be.true;
    });


    it('should create DecisionTable', function() {
      var subProcess = moddle.create('dmn:DecisionTable');

      expect(subProcess.$type).to.eql('dmn:DecisionTable');
      expect(subProcess.$instanceOf('dmn:Expression')).to.be.true;
    });

  });

});
