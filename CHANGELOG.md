# Changelog

All notable changes to [dmn-moddle](https://github.com/bpmn-io/dmn-moddle) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 10.0.0

* `FEAT`: promisify `#fromXML` and `#toXML` APIs ([#19](https://github.com/bpmn-io/dmn-moddle/issues/19))
* `FIX`: support `di:extension` elements ([#20](https://github.com/bpmn-io/dmn-moddle/issues/20))
* `CHORE`: bump to `moddle-xml@9.0.5`

### Breaking Changes

* `#fromXML` and `#toXML` APIs now return a Promise. These APIs don't support callbacks anymore and their usage requires to move from using Callbacks to Promises.

## 9.1.0

* `FEAT`: add biodi@2.0 package which allows to set columns width ([#15](https://github.com/bpmn-io/dmn-moddle/pull/15))
* `FIX`: use lowercase DMN prefix ([#8](https://github.com/bpmn-io/dmn-moddle/issues/8))

## 9.0.0

_An update of the meta-model to better represent the DMN schema ([#12](https://github.com/bpmn-io/dmn-moddle/pull/12))._

* `FEAT`: properly represent DMN model elements using DMN schema derived inheritance ([#12](https://github.com/bpmn-io/dmn-moddle/pull/12))
* `FIX`: correctly import `dmn:Context` elements
* `FIX`: correct `FunctionItem#parameters`
* `CHORE`: remove `Decision#literalExpression`, `Decision#decisionTable` accessors in favor of DMN schema derived `Decision#decisionLogic`
* `CHORE`: remove `Definitions#performanceIndicator`, `Definitions#organizationUnit` accessors in favor of DMN schema derived `Definitions#businessContextElement`
* `CHORE`: rename `List#element` to `List#elements` to match DMN schema
* `CHORE`: remove unused virtual / inverse properties
* `CHORE`: remove unneeded serialization hints

### Breaking Changes

* As indicated above, access to certain elements, most importantly `Decision#...` is now done via DMN standards derived accessors. This improves the robustness of import, export, validation and error handling and prevents unintentional miss-use.

## 8.0.4

* `FIX`: correct `dmn:TextAnnotation#textFormat` default

## 8.0.3

* `FIX`: do not assign duplicate `dmndi:DMNStyle#id`
* `FIX`: read and serialize correctly `dmndi:DMNDiagram#Size`

## 8.0.2

* `CHORE`: drop unneeded files from bundle

## 8.0.1

* `FIX`: add package names ([`2859ed`](https://github.com/bpmn-io/dmn-moddle/commit/2859edc1835217001fe39487eb57bedee4eba76a))

## 8.0.0

_A rewrite of the library that makes it compatible with DMN 1.3 files._

* `FEAT`: read and write DMN 1.3 diagrams
* `FEAT`: recognize full DMN 1.3
* `CHORE`: generate schema from XMI ([`f4bb15`](https://github.com/bpmn-io/dmn-moddle/pull/6/commits/f4bb15627fbc434b3342c4a3db7b5ab068d7e908))
* `CHORE`: run integration tests with DMN TCK ([`64a694`](https://github.com/bpmn-io/dmn-moddle/pull/6/commits/64a694d5e8616136af9a1ba6d147173334b3b9ac))
* `CHORE`: update to cmof-parser@0.5.0

### Breaking Changes

* We support DMN 1.3 diagrams only. Stick to `dmn-moddle@7.0.0` or use the [`dmn-migration-utility`](https://github.com/bpmn-io/dmn-migration-utility) to convert your diagrams.
* We removed the `biodi` package without replacement ([`2334ad`](https://github.com/bpmn-io/dmn-moddle/pull/6/commits/2334adaf3e10486e869781f30844c8def9b1b2df)). Migrating your diagrams to DMN 1.3 with the [`dmn-migration-utility`](https://github.com/bpmn-io/dmn-migration-utility) will convert `biodi` to proper DMN 1.3 DI.

## 7.0.0

* `FEAT`: add pre-built distribution
* `CHORE`: update to moddle@5.0.1, moddle-xml@8.0.1

### Breaking Changes

* `FEAT`: dropped `lib/` from npm package; import from the root now

## 6.0.0

### Breaking Changes

* `FEAT`: dropped `camunda` extension definition, it moved to a [seperate library](https://github.com/camunda/camunda-dmn-moddle)

## 5.0.0

### Breaking Changes

* `FEAT`: migrate to ES modules. Use `esm` or a ES module aware transpiler to consume this library.

### Other Improvements

* `CHORE`: bump dependency versions

## 4.0.0

* `FEAT`: encode entities in body properties (rather than using CDATA escaping)

## 3.0.1

* `FIX`: properly decode `text` entities

## 3.0.0

* `CHORE`: improve error handling on invalid attributes
* `CHORE`: drop lodash in favor of [min-dash](https://github.com/bpmn-io/min-dash)

## ...

Check `git log` for earlier history.
