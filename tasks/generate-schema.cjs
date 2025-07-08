const fs = require('fs');

const parseFile = require('cmof-parser');

const {
  transformDC,
  transformDI,
  transformDMN,
  transformDMNDI
} = require('./transforms/index.cjs');

async function generateSchema(files) {
  files.forEach(async file => {
    const {
      options,
      source,
      target,
      transform
    } = file;

    const parsed = await parseFile(fs.readFileSync(source, 'utf8'), options);

    const transformed = await transform(parsed);

    fs.writeFileSync(target, JSON.stringify(transformed, null, 2));
  });
}

generateSchema([
  {
    source: 'resources/dmn/xmi/DMN13.xmi',
    target: 'resources/dmn/json/dmn13.json',
    transform: transformDMN,
    options: {
      clean: true,
      prefixNamespaces: {
        'DC': 'dc',
        'DI': 'di',
        'http://www.omg.org/spec/BMM/20130801/BMM.xmi': 'bmm',
        'http://www.omg.org/spec/BPMN/20100501/BPMN20.cmof': 'bpmn',
        'https://www.omg.org/spec/DMN/20191111/DMNDI13.xmi': 'dmndi'
      }
    }
  },
  {
    source: 'resources/dmn/xmi/DMNDI13.xmi',
    target: 'resources/dmn/json/dmndi13.json',
    transform: transformDMNDI,
    options: {
      clean: true,
      prefixNamespaces: {
        'DC': 'dc',
        'DI': 'di'
      }
    }
  },
  {
    source: 'resources/dmn/xmi/DMNDI13.xmi',
    target: 'resources/dmn/json/dc.json',
    transform: transformDC,
    options: {
      clean: true,
      prefixNamespaces: {
        'DC': 'dc',
        'DI': 'di'
      }
    }
  },
  {
    source: 'resources/dmn/xmi/DMNDI13.xmi',
    target: 'resources/dmn/json/di.json',
    transform: transformDI,
    options: {
      clean: true,
      prefixNamespaces: {
        'DC': 'dc',
        'DI': 'di'
      }
    }
  }
]);
