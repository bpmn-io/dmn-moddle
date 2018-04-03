> As of version `5.0.0` this library exposes ES modules. Use [esm](https://github.com/standard-things/esm) to consume it or a ES module aware transpiler such as Webpack, Rollup or Browserify + babelify to bundle it for the browser.


# dmn-moddle

[![Build Status](https://travis-ci.org/bpmn-io/dmn-moddle.svg?branch=master)](https://travis-ci.org/bpmn-io/dmn-moddle)

Read and write DMN files in NodeJS and the browser.

__dmn-moddle__ uses the [DMN specification](http://www.omg.org/spec/DMN/1.1/) to validate the input and produce correct DMN XML. The library is built on top of [moddle](https://github.com/bpmn-io/moddle) and [moddle-xml](https://github.com/bpmn-io/moddle-xml).


## Resources

*   [Issues](https://github.com/bpmn-io/dmn-moddle/issues)
*   [Examples](https://github.com/bpmn-io/dmn-moddle/tree/master/test/spec/xml)


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
