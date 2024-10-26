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

### Options

You can pass options to the plugin:

```js
const md = new MarkdownIt().use(rubyPlugin, {
  rp: ['(', ')'] // Add parentheses around ruby text
});

// Output: <ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>
md.render('{漢字|かんじ}');
```

#### Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rp` | `[string, string]` | `['', '']` | Array of opening and closing parentheses to wrap around ruby text. When both values are empty strings, no `rp` elements will be output. |

## License

[MIT](https://github.com/lostandfound/markdown-it-ruby/blob/master/LICENSE)
