'use strict';

const path = require('path');
const generate = require('markdown-it-testgen');
const MarkdownIt = require('markdown-it');
const rubyPlugin = require('../index.cjs');
const assert = require('assert');

/*eslint-env mocha*/

describe('markdown-it-ruby (CommonJS)', () => {
  const md = new MarkdownIt()
    .use(rubyPlugin);

  generate(path.join(__dirname, 'fixtures/ruby.txt'), md);

  describe('rp option', () => {
    it('should add rp elements when rp option is provided', () => {
      const mdWithRp = new MarkdownIt().use(rubyPlugin, { rp: ['(', ')'] });
      const result = mdWithRp.render('{漢字|かんじ}');
      assert.strictEqual(
        result.trim(),
        '<p><ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby></p>'
      );
    });

    it('should work with double parentheses', () => {
      const mdWithDoubleRp = new MarkdownIt().use(rubyPlugin, { rp: ['((', '))'] });
      const result = mdWithDoubleRp.render('{漢字|かんじ}');
      assert.strictEqual(
        result.trim(),
        '<p><ruby>漢字<rp>((</rp><rt>かんじ</rt><rp>))</rp></ruby></p>'
      );
    });

    it('should not add rp elements when rp option is empty strings', () => {
      const mdWithEmptyRp = new MarkdownIt().use(rubyPlugin, { rp: ['', ''] });
      const result = mdWithEmptyRp.render('{漢字|かんじ}');
      assert.strictEqual(
        result.trim(),
        '<p><ruby>漢字<rt>かんじ</rt></ruby></p>'
      );
    });
  });
}); 