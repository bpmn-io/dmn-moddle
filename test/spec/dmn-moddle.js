import expect from '../expect.js';

import {
  createModdle
} from '../helper.js';


describe('dmn-moddle', function() {

  let moddle;

  beforeEach(function() {
    moddle = createModdle();
  });


  describe('#getType', function() {

    it('should get type of Decision', function() {

      // when
      const type = moddle.getType('dmn:Decision');

      // then
      expect(type).to.exist;
      expect(type.$descriptor).to.exist;
    });

  });


  describe('#create', function() {

    it('should create DMNElement', function() {

      // when
      const dmnElement = moddle.create('dmn:DMNElement');

      // then
      expect(dmnElement.$type).to.eql('dmn:DMNElement');
    });


    it('should create Definitions', function() {

      // when
      const definitions = moddle.create('dmn:Definitions');

      // then
      expect(definitions.$type).to.eql('dmn:Definitions');
    });


    it('should create Decision', function() {

      // when
      var decision = moddle.create('dmn:Decision');

      // then
      expect(decision.$type).to.eql('dmn:Decision');
      expect(decision.$instanceOf('dmn:DRGElement')).to.be.true;
    });


    it('should create DecisionTable', function() {

      // when
      const decisionTable = moddle.create('dmn:DecisionTable');

      // then
      expect(decisionTable.$type).to.eql('dmn:DecisionTable');
      expect(decisionTable.$instanceOf('dmn:Expression')).to.be.true;
    });


    it('should create TextAnnotation', function() {

      // when
      const annotation = moddle.create('dmn:TextAnnotation');

      // then
      expect(annotation.textFormat).to.eql('text/plain');
    });

  });

});
