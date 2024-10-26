# markdown-it-ruby

[![NPM version](https://img.shields.io/npm/v/markdown-it-ruby.svg?style=flat)](https://www.npmjs.org/package/markdown-it-ruby)

> Ruby annotations (`<ruby>`) tag plugin for [markdown-it](https://github.com/markdown-it/markdown-it) markdown parser.

`{ruby base|ruby text}` => `<ruby>ruby base<rt>ruby text</rt></ruby>`

Markup is based on [DenDenMarkdown](https://conv.denshochan.com/markdown) definition. 


## Install

```bash
npm install markdown-it-ruby --save
```

## Usage

### ESM (Recommended)
```js
import MarkdownIt from 'markdown-it';
import rubyPlugin from 'markdown-it-ruby';

const md = new MarkdownIt().use(rubyPlugin);
md.render('{ruby base|ruby text}'); // => '<p><ruby>ruby base<rt>ruby text</rt></ruby></p>'
```

### CommonJS
```js
const MarkdownIt = require('markdown-it');
const rubyPlugin = require('markdown-it-ruby');

const md = new MarkdownIt().use(rubyPlugin);
md.render('{ruby base|ruby text}'); // => '<p><ruby>ruby base<rt>ruby text</rt></ruby></p>'
```

## License

[MIT](https://github.com/lostandfound/markdown-it-ruby/blob/master/LICENSE)
