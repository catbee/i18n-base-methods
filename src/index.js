const utils = require('./utils');
const _get = require('lodash.get');

const GLUE = '\u0004';

module.exports = {
  /**
   * Simple translate.
   *
   * @param {Object} data
   * @param {Object} data.l10n - po2json output json object
   * @param {string} str - string to translate
   * @returns {string}
   */
  _t (data, str) {
    return _get(data, ['l10n', str, 1], str);
  },

  /**
   * Simple translate with context.
   *
   * @param {Object} data
   * @param {Object} data.l10n - po2json output json object
   * @param {string} context - translate context
   * @param {string} str - string o translate
   * @param {string} glue - po2json context with str glue
   * @returns {string}
   */
  _pt (data, context, str, glue = GLUE) {
    return _get(data, ['l10n', `${context}${glue}${str}`, 1], str);
  },

  /**
   * Translate with plural form.
   *
   * @param {Object} data
   * @param {Object} data.l10n - po2json output json object
   * @param {Object} data.plural - default plural form if no translate found
   * @param {Array} plurals - array of str plural forms
   * @param {number} number - number for pluralForm
   * @returns {string}
   */
  _nt (data, plurals, number) {
    const selector = _get(plurals, 0);

    return plural(data, plurals, selector, number);
  },

  /**
   * Translate with context and plural form.
   *
   * @param {Object} data
   * @param {Object} data.l10n - po2json output json object
   * @param {Object} data.plural - default plural form if no translate found
   * @param {string} context - translate context
   * @param {Array} plurals - array of str plural forms
   * @param {number} number - number for pluralForm
   * @param {string} glue
   * @returns {string}
   */
  _npt (data, context, plurals, number, glue = GLUE) {
    const str = _get(plurals, 0);
    const selector = `${context}${glue}${str}`;

    return plural(data, plurals, selector, number);
  }
};

function plural (data, plurals, selector, number) {
  const l10n = _get(data, 'l10n');
  const defaultPlural = _get(data, 'plural');

  // get plural function from Plural-Forms string
  let plural = utils.getPlural(l10n, defaultPlural);
  let n = plural(number);

  const translate = _get(l10n, [selector, n + 1]);

  // if translate found in l10n object, fine! Return it.
  if (translate) {
    return translate;
  }

  // else not found calc default pluralForm (for default language)
  plural = utils.parseForm(defaultPlural);
  n = plural(number);

  // return correct plural form for default language
  return _get(plurals, n);
}