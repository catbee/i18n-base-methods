const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { experiment, test } = lab;

const assert = require('assert');

const i18n = require('../../src/index');

/**
 * default po2json context and string glue
 * @type {string}
 */
const GLUE = '\u0004';

const defaultPlural = 'nplurals=2; plural=(n != 1)'; // en
const defaultPlurals = [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const pluralForm = 'nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);'; // ru

experiment('I18n base function', () => {
  experiment('_t.', () => {
    test('Without translates, return input str', (done) => {
      const str = 'Hello';

      assert.equal(str, i18n._t({}, str));

      done();
    });

    test('With translates, return input translate', (done) => {
      const str = 'Hello';
      const translate = 'Привет';

      const l10n = {
        '': { 'plural-forms': pluralForm },
        [str]: [null, translate]
      };

      assert.equal(translate, i18n._t({ l10n }, str));

      done();
    });
  });

  experiment('_pt', () => {
    test('Without translate, return input str', (done) => {
      const context = 'greeting';
      const str = 'Hello';

      assert.equal(str, i18n._pt({}, context, str));

      done();
    });

    test('With translate, return input translate', (done) => {
      const context = 'greeting';
      const str = 'Hello';
      const translate = 'Привет';

      const l10n = {
        '': { 'plural-forms': pluralForm },
        [`${context}${GLUE}${str}`]: [null, translate]
      };

      assert.equal(translate, i18n._pt({ l10n }, context, str));

      done();
    });

    test('With translate and custom glue, return input translate', (done) => {
      const context = 'greeting';
      const str = 'Hello';
      const translate = 'Привет';
      const glue = 'glue';

      const l10n = {
        '': { 'plural-forms': pluralForm },
        [`${context}${glue}${str}`]: [null, translate]
      };

      assert.equal(translate, i18n._pt({ l10n }, context, str, glue));

      done();
    });
  });

  experiment('_nt', () => {
    test('Without translate, return input first plural form', (done) => {
      const plurals = ['apple', 'apples'];
      const pluralNumber = 1;

      assert.equal(plurals[0], i18n._nt({}, plurals, pluralNumber));

      done();
    });

    const pluralsRuTranslates = ['яблоко', 'яблока', 'яблок'];
    const ruPlurals = [2, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1];
    for (let n = 0; n < ruPlurals.length; n++) {
      test('With translate, return translate plural form', (done) => {
        const plurals = ['apple', 'apples'];
        const str = plurals[0];

        const l10n = {
          '': { 'plural-forms': pluralForm },
          [str]: [null, ...pluralsRuTranslates]
        };

        assert.equal(pluralsRuTranslates[ruPlurals[n]], i18n._nt({
          l10n,
          plural: defaultPlural
        }, plurals, n));

        done();
      });
    }

    for (let n = 0; n < defaultPlurals.length; n++) {
      test('Without translate, but with plural form, return source with default plural form', (done) => {
        const plurals = ['pobočka', 'pobočky', 'poboček'];

        const l10n = {
          '': { 'plural-forms': 'nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2' }
        };

        assert.equal(plurals[defaultPlurals[n]], i18n._nt({
          l10n,
          plural: defaultPlural
        }, plurals, n));

        done();
      });
    }
  });

  experiment('_npt', () => {
    test('Without translate, return first input plural form', (done) => {
      const context = 'apples';
      const plurals = ['apple', 'apples'];
      const pluralNumber = 1;

      assert.equal(plurals[0], i18n._npt({}, context, plurals, pluralNumber));

      done();
    });

    const pluralsTranslates = ['яблоко', 'яблока', 'яблок'];
    const ruPlurals = [2, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1];
    for (let n = 0; n < ruPlurals.length; n++) {
      test('With translate, return translate plural form', (done) => {
        const context = 'apples';
        const plurals = ['apple', 'apples'];
        const str = plurals[0];

        const l10n = {
          '': { 'plural-forms': pluralForm },
          [`${context}${GLUE}${str}`]: [null, ...pluralsTranslates]
        };

        assert.equal(pluralsTranslates[ruPlurals[n]], i18n._npt({ l10n }, context, plurals, n));

        done();
      });
    }

    for (let n = 0; n < defaultPlurals.length; n++) {
      test('Without translate, but with default plural form, return input with default plural form', (done) => {
        const context = 'branches';
        const plurals = ['branch', 'branches'];

        const l10n = {
          '': { 'plural-forms': 'nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2' }
        };

        assert.equal(plurals[defaultPlurals[n]], i18n._npt({
          l10n, plural: defaultPlural
        }, context, plurals, n));

        done();
      });
    }
  });
});
