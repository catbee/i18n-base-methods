const _get = require('lodash.get');
const _memoize = require('lodash.memoize');
const parsePluralForm = _memoize(require('parse-gettext-plural-form'));

// default Plural-Forms
const EN_PLURAL_FORM = 'nplurals=1; plural=0;';

module.exports = {
  parseForm (form = EN_PLURAL_FORM) {
    return parsePluralForm(form);
  },

  getPlural (l10n, defaultPluralForm = EN_PLURAL_FORM) {
    const form = _get(l10n, ['', 'plural-forms'], defaultPluralForm);

    return parsePluralForm(form);
  }
};


