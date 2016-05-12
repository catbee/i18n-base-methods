# i18n-base-methods

[![Build Status][travis-img]][travis-url]
[![Code Coverage][codecov-img]][codecov-url]

Four base methods for i18n:

- `_t (data:Object, str:string)` - Simple translate
- `_pt (data:Object, context:string, str:string)` - Simple translate with context
- `_nt (data:Object, plurals:Array, num:number), ` - Translate with plural form
- `_npt (data:Object, context:string, plurals:Array, num:number)` - Translate with plural form and context

`data` object expects 2 properties: 

1. `l10n` property, which contains [`po2json`](https://www.npmjs.com/package/po2json) output:

```js
l10n: {
  "": {
    "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)"
  },
  "Your name": [ null, "Vaše jméno"],
  // ...
}
```
2. `plural` property, which contains Plural-Form for your application default language. Used if translate not found for current phrase. If not sended, default plural number always 0.

## Example

``` js
const i18n = require('i18n-base-methods');

const enPluralForm = 'nplurals=2; plural=(n != 1);';
const l10n = { /* po2json output */ };
const plurals = ['name', 'names'];
const context = 'name';
i18n._npt({ l10n, plural: enPluralForm }, context, plurals, 1)) // name
i18n._npt({ l10n, plural: enPluralForm }, context, plurals, 9)) // names
```
