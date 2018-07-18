import {
  assign
} from 'min-dash';

import DmnModdle from './dmn-moddle';

import DmnPackage from '../resources/dmn/json/dmn.json';
import BiodcPackage from '../resources/dmn/bpmn-io/dc.json';
import BiodiPackage from '../resources/dmn/bpmn-io/biodi.json';

var packages = {
  dmn: DmnPackage,
  dc: BiodcPackage,
  biodi: BiodiPackage
};

export default function(additionalPackages, options) {
  var pks = assign({}, packages, additionalPackages);

  return new DmnModdle(pks, options);
}