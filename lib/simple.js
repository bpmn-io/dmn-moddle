'use strict';

var assign = require('lodash/object/assign');

var DmnModdle = require('./dmn-moddle');

var packages = {
  dmn: require('../resources/dmn/json/dmn.json'),
  camunda: require('../resources/dmn/camunda/camunda.json')
};

module.exports = function(additionalPackages, options) {
  return new DmnModdle(assign({}, packages, additionalPackages), options);
};
