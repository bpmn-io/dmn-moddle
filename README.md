# dmn-moddle

Read and write DMN files in NodeJS and the browser.

__dmn-moddle__ uses the [DMN specification](http://www.omg.org/spec/DMN/1.0/) to validate the input and produce correct DMN XML. The library is built on top of [moddle](https://github.com/bpmn-io/moddle) and [moddle-xml](https://github.com/bpmn-io/moddle-xml).

## Resources

*   [Issues](https://github.com/bpmn-io/dmn-moddle/issues)
*   [Examples](https://github.com/bpmn-io/dmn-moddle/tree/master/test/spec/xml)


## Building the Project

You need [grunt](http://gruntjs.com) to build the project.

To run the test suite that includes XSD schema validation you must have a Java JDK installed and properly exposed through the `JAVA_HOME` variable.

Execute the test via

```
grunt test
```

Perform a complete build of the application via

```
grunt
```


## License

Use under the terms of the [MIT license](http://opensource.org/licenses/MIT).
