const debug = require('debug')('postcss-add-namespace');

/**
 *  Public:
 *
 *  * `selector` {String} - css rule selector to check.
 *  * `test` {String} or {RegExp} to check `selector`
 *
 *  ## Example
 *
 *    selectorMatchesTest('.icon', '.icon');
 *    // returns true
 *
 *  Returns {Bool}
 */
function selectorMatchesTest(selector, test) {
  if (test instanceof RegExp) {
    return test.exec(selector);
  } else if (typeof test === 'string') {
    return selector === test;
  }
  return false;
}

/**
 *  Public:
 *
 *  * `selector` {String} selector to check if it matches the tests.
 *  * `test` {String} or {Array} of {Strings} or {RegExp} to use to check.
 *  * `fallback` {Bool} if no `test` are added, it will return `fallback`.
 *
 *  ## Example
 *
 *    selectorMatchesTests('.icon', '.icon', true);
 *    // returns true
 *
 *  Returns {Bool}
 */
function selectorMatchesTests(selector, test, fallback) {
  // Convert strings to arrays
  const tests = (typeof test === 'string') ? [test] : test;

  if (!tests || !tests.length) return fallback;

  return tests.some((newTest) =>
    selectorMatchesTest(selector, newTest)
  );
}
/**
 *  AddNamespace Class
 */
export default class AddNamespace {
  /**
   *  Public: initiates AddNamespace object and loads options
   *
   *  * `css` parsed postcss css.
   *  * `namespace` (optional) the {String} added to the beginning of classes.
   *  * `opts` (optional) {Object} of options that determine which classes will
   *    have the namespace prefix added. Expected properties:
   *    * `not` specific classes or classes that match a regex to skip.
   *    * `only` specific classes or classes that match a regex to prefix.
   *
   *  ## Examples
   *
   *  Designed for use in a postcss plugin.
   *
   *    var postcss = require('postcss');
   *    var addNamespace = require('./add-namespace');
   *    exports.default = postcss.default.plugin('postcss-add-namespace', function (namespace) {
   *      var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
   *      return function (css) {
   *        return new addNamespace(css, namespace, opts);
   *      };
   *    });
   *
   *  Returns postcss {Object} with result property (`css`).
   */
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
  /**
   *  Private: checks if selector should be prefixed with the namespace.
   *
   *  * `selector` {String} of rule selector.
   *
   *  ## Example
   *
   *  With `{ only: '.icon' }`
   *
   *    shouldIncludeSelector('.icon { prop: value; }');
   *
   *  Will return `true`
   *
   *  Returns {Bool}
   */
  shouldIncludeSelector(selector) {
    return selectorMatchesTests(selector, this.only, true);
  }
  /**
   *  Private: checks if selector should be ignored while adding the namespace prefix.
   *
   *  * `selector` {String} of rule selector.
   *
   *  ## Example
   *
   *  With `{ not: '.icon' }`
   *
   *    shouldIgnoreSelector('.icon { prop: value; }');
   *
   *  Will return `false`
   *
   *  Returns {Bool}
   */
  shouldIgnoreSelector(selector) {
    return selectorMatchesTests(selector, this.not, false);
  }
}
