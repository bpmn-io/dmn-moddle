# Changelog

All notable changes to [dmn-moddle](https://github.com/bpmn-io/dmn-moddle) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

* `CHORE`: generate schema from XMI ([`f4bb15`](https://github.com/bpmn-io/dmn-moddle/pull/6/commits/f4bb15627fbc434b3342c4a3db7b5ab068d7e908))
* `CHORE`: run integration tests with DMN TCK ([`64a694`](https://github.com/bpmn-io/dmn-moddle/pull/6/commits/64a694d5e8616136af9a1ba6d147173334b3b9ac))
* `CHORE`: update to cmof-parser@0.5.0

### Breaking Changes

* `FEAT`: migrate to DMN 1.3
* `CHORE`: remove biodi package ([`2334ad`](https://github.com/bpmn-io/dmn-moddle/pull/6/commits/2334adaf3e10486e869781f30844c8def9b1b2df))

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
