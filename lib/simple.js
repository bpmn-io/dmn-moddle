import {
  assign
} from 'min-dash';

import DmnModdle from './dmn-moddle';

import DcPackage from '../resources/dmn/json/dc.json';
import DiPackage from '../resources/dmn/json/di.json';
import DmnPackage from '../resources/dmn/json/dmn13.json';
import DmnDiPackage from '../resources/dmn/json/dmndi13.json';
import BioDiPackage from '../resources/dmn/bpmn-io/biodi.json';

var packages = {
  dc: DcPackage,
  di: DiPackage,
  dmn: DmnPackage,
  dmndi: DmnDiPackage,
  biodi: BioDiPackage
};

export default function(additionalPackages, options) {
  var pks = assign({}, packages, additionalPackages);

  return new DmnModdle(pks, options);
}