'use strict';

var assign = require('lodash/object/assign');

var DmnModdle = require('./dmn-moddle');

var packages = {
  dmn: require('../resources/dmn/json/dmn.json'),
  camunda: require('../resources/dmn/camunda/camunda.json'),
  dc: require('../resources/dmn/bpmn-io/dc.json'),
  biodi: require('../resources/dmn/bpmn-io/biodi.json')
};

module.exports = function(additionalPackages, options) {
  return new DmnModdle(assign({}, packages, additionalPackages), options);
};
