# dmn-moddle

[![CI](https://github.com/bpmn-io/dmn-moddle/workflows/CI/badge.svg)](https://github.com/bpmn-io/dmn-moddle/actions?query=workflow%3ACI)

Read and write DMN 1.3 files in NodeJS and the browser.

__dmn-moddle__ uses the [DMN specification](http://www.omg.org/spec/DMN/1.3/) to validate the input and produce correct DMN XML. The library is built on top of [moddle](https://github.com/bpmn-io/moddle) and [moddle-xml](https://github.com/bpmn-io/moddle-xml).


## Usage

Get the library via [npm package](https://www.npmjs.org/package/dmn-moddle). Consume it in NodeJS or bundle it using your favorite build tool.

```javascript
import { DmnModdle } from 'dmn-moddle';

const moddle = new DmnModdle();

const xmlStr =
  '<?xml version="1.0" encoding="UTF-8"?>' +
    '<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" ' +
                 'id="Definitions_1" ' +
                 'namespace="http://camunda.org/schema/1.0/dmn">' +
      '<decision id="Decision_1" name="Decision" />' +
    '</definitions>;


const {
  rootElement: definitions
} = await moddle.fromXML(xmlStr);

// update id attribute
definitions.set('id', 'NEW ID');

// add a root element
const dmnDecision = moddle.create('dmn:Decision', { id: 'MyDecision' });
definitions.get('drgElement').push(dmnDecision);

// xmlStrUpdated contains new id and the added process
const {
  xml: xmlStrUpdated
} = await moddle.toXML(definitions);
```


## Resources

* [Issues](https://github.com/bpmn-io/bpmn-moddle/issues)
* [Examples](https://github.com/bpmn-io/bpmn-moddle/tree/master/test/spec/xml)
* [Changelog](./CHANGELOG.md)


## Building the Project

To run the test suite that includes XSD schema validation you must have a Java JDK installed and properly exposed through the `JAVA_HOME` variable.

Execute the test via

```
npm test
```

Perform a complete build of the library via

```
npm run all
```


## License

Use under the terms of the [MIT license](http://opensource.org/licenses/MIT).
