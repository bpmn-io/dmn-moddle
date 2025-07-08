import {
  assign
} from 'min-dash';

import DmnModdle from './dmn-moddle.js';

import DcPackage from '../resources/dmn/json/dc.json' with { type: 'json' };
import DiPackage from '../resources/dmn/json/di.json' with { type: 'json' };
import DmnPackage from '../resources/dmn/json/dmn13.json' with { type: 'json' };
import DmnDiPackage from '../resources/dmn/json/dmndi13.json' with { type: 'json' };
import BioDiPackage from '../resources/dmn/bpmn-io/biodi.json' with { type: 'json' };

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
