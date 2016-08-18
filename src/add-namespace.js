const debug = require('debug')('postcss-add-namespace');

// Returns true if a selector matches a test
function selectorMatchesTest(selector, test) {
  if (test instanceof RegExp) {
    return test.exec(selector);
  } else if (typeof test === 'string') {
    return selector === test;
  }
  return false;
}

// Returns true if a selector matches any test
function selectorMatchesTests(selector, test, fallback) {
  // Convert strings to arrays
  const tests = (typeof test === 'string') ? [test] : test;

  if (!tests || !tests.length) return fallback;

  return tests.some((newTest) =>
    selectorMatchesTest(selector, newTest)
  );
}

export default class Inherit {
  constructor(css, namespace = '', opts = {}) {
    this.root = css;
    this.ns = namespace;
    this.only = opts.only;
    this.not = opts.not;

    if (!this.ns || this.ns === '') return;

    this.root.walkRules(rule => {
      const selector = rule.selector;
      if (this.shouldIgnoreSelector(selector) || !this.shouldIncludeSelector(selector)) return;
      rule.selector = selector.replace(/\./g, `.${this.ns}-`);
      debug(`${selector} replaced with ${rule.selector}`);
    });
  }
  shouldIncludeSelector(selector) {
    return selectorMatchesTests(selector, this.only, true);
  }
  shouldIgnoreSelector(selector) {
    return selectorMatchesTests(selector, this.not, false);
  }
}
