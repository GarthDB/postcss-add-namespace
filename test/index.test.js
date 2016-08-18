import postcss from 'postcss';
import test from 'ava';
import fs from 'fs';
import addNamespace from '../src/index';

function read(file) {
  return fs.readFileSync(`./${file}.css`, 'utf8').trim();
}

function runAddNamespace(input, ns, opts) {
  return postcss([addNamespace(ns, opts)]).process(input);
}

test('should add namespace', t => {
  const output = read('expected/namespace.expected');
  return runAddNamespace(read('fixtures/namespace.fixture'), 'dam')
  .then(result => {
    t.deepEqual(result.css.trim(), output);
  });
});

test('should not add namespace by default', t => {
  const output = read('expected/no.namespace.expected');
  return runAddNamespace(read('fixtures/namespace.fixture'))
  .then(result => {
    t.deepEqual(result.css.trim(), output);
  });
});

test('should add the namespace to selectors inside of mediaqueries', t => {
  const output = read('expected/mediaquery.expected');
  return runAddNamespace(read('fixtures/mediaquery.fixture'), 'dam')
  .then(result => {
    t.deepEqual(result.css.trim(), output);
  });
});

test('should not add namespace by if empty string is passed as argument', t => {
  const output = read('expected/no.namespace.expected');
  return runAddNamespace(read('fixtures/namespace.fixture'), '')
  .then(result => {
    t.deepEqual(result.css.trim(), output);
  });
});

test('should add namespace to compound selector', t => {
  const output = read('expected/compound.selector.expected');
  return runAddNamespace(read('fixtures/compound.selector.fixture'), 'dam')
  .then(result => {
    t.deepEqual(result.css.trim(), output);
  });
});

test('should not add namespace for excluded selectors with regex', t => {
  const output = read('expected/filter.selector.only-buttons.expected');
  return runAddNamespace(read('fixtures/filter.selector.fixture'), 's', { not: [/icon/] })
  .then(result => {
    t.deepEqual(result.css.trim(), output);
  });
});

test('should not add namespace for excluded selectors with string', t => {
  const output = read('expected/filter.selector.only-buttons.expected');
  return runAddNamespace(read('fixtures/filter.selector.fixture'), 's',
    { not: [
      '.icon',
      '.icon-triangle-up:before',
      '.icon-triangle-down:before',
    ] }
  )
  .then(result => {
    t.deepEqual(result.css.trim(), output);
  });
});

test('should not add namespace for excluded selectors with mixed regex and string', t => {
  const output = read('fixtures/filter.selector.fixture');
  return runAddNamespace(output, 's',
    { not: [
      /icon/,
      '.button',
      '.toolbar-button',
    ] }
  )
  .then(result => {
    t.deepEqual(result.css.trim(), output);
  });
});

test('should only add namespace for included selectors with regex', t => {
  const output = read('expected/filter.selector.not-buttons.expected');
  return runAddNamespace(read('fixtures/filter.selector.fixture'), 's', { only: [/icon/] }
  )
  .then(result => {
    t.deepEqual(result.css.trim(), output);
  });
});

test('should only add namespace for included selectors with strings', t => {
  const output = read('expected/filter.selector.not-buttons.expected');
  return runAddNamespace(read('fixtures/filter.selector.fixture'), 's',
    { only: [
      '.icon',
      '.icon-triangle-up:before',
      '.icon-triangle-down:before',
    ] }
  )
  .then(result => {
    t.deepEqual(result.css.trim(), output);
  });
});

test('should only add namespace for included selectors with mixed regex and strings', t => {
  const output = read('expected/filter.selector.all.expected');
  return runAddNamespace(read('fixtures/filter.selector.fixture'), 's',
    { only: [
      /icon/,
      '.button',
      '.toolbar-button',
    ] }
  )
  .then(result => {
    t.deepEqual(result.css.trim(), output);
  });
});

test('should only add namespace for included selectors that do not match excluded selectors', t => {
  const output = read('expected/filter.selector.not-toolbar-button.expected');
  return runAddNamespace(read('fixtures/filter.selector.fixture'), 's',
    { only: [
      /icon/,
      /button/,
    ],
    not: [
      '.toolbar-button',
    ] }
  )
  .then(result => {
    t.deepEqual(result.css.trim(), output);
  });
});
