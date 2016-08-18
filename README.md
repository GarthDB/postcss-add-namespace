# PostCSS Add Namespace

[![Build Status](https://travis-ci.org/GarthDB/postcss-add-namespace.svg?branch=master)](https://travis-ci.org/GarthDB/postcss-add-namespace) [![Code Climate](https://codeclimate.com/github/GarthDB/postcss-add-namespace/badges/gpa.svg)](https://codeclimate.com/github/GarthDB/postcss-add-namespace) [![Test Coverage](https://codeclimate.com/github/GarthDB/postcss-add-namespace/badges/coverage.svg)](https://codeclimate.com/github/GarthDB/postcss-add-namespace/coverage) [![Issue Count](https://codeclimate.com/github/GarthDB/postcss-add-namespace/badges/issue_count.svg)](https://codeclimate.com/github/GarthDB/postcss-add-namespace/issues) [![Dependency Status](https://david-dm.org/GarthDB/postcss-add-namespace.svg)](https://david-dm.org/GarthDB/postcss-add-namespace) [![Inline docs](http://inch-ci.org/github/GarthDB/postcss-add-namespace.svg?branch=master)](http://inch-ci.org/github/GarthDB/postcss-add-namespace) [![npm version](https://badge.fury.io/js/postcss-add-namespace.svg)](https://badge.fury.io/js/postcss-add-namespace)

---

<a href="http://postcss.org/"><img align="right" width="95" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="http://postcss.github.io/postcss/logo.svg"></a>

Namespace plugin for PostCSS - based on [Kristofer Joseph's](http://twitter.com/dam) [rework-namespace](https://github.com/kristoferjoseph/rework-namespace) plugin.

## Usage

Pass the namespace as the first argument:

```js
var namespace = require('postcss-add-namespace');

var css = postcss([namespace('ns')])
  .process('.button { color: black; }')
  .then(results => {results.toString()});
```

Results:

```css
.ns-button { color: black; }
```

### Options

Pass an options object as the second argument.

#### options.not

Don't prefix specific classes or classes that match a regex.

```js
var css = postcss([namespace('ns', { not: [ /\.icon/, '.button-bar' ] })])
  .process(inputCSS)
  .then(results => {results.toString()});
```

#### options.only

Only prefix specific classes or classes that match a regex.

```js
var css = postcss([namespace('ns', { only: [ /\.icon/, '.icon-group' ] })])
  .process(inputCSS)
  .then(results => {results.toString()});
```

### Examples

#### Prefix every class

```js
var css = postcss([namespace('ns')])
  .process(inputCSS)
  .then(results => {results.toString()});
```

#### Prefix every class except icon classes

```js
var css = postcss([namespace('ns', { not: /\.icon-/ })])
  .process(inputCSS)
  .then(results => {results.toString()});
```

#### Prefix all classes with "button" in them except .button itself

```js

var css = postcss([namespace('ns', {
    only: /button/,
    not: '.button'
  })])
  .process(inputCSS)
  .then(results => {results.toString()});
```
