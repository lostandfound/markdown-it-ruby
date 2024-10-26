'use strict';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import generate from 'markdown-it-testgen';
import MarkdownIt from 'markdown-it';
import rubyPlugin from '../index.mjs';
import { describe, it } from 'mocha';
import assert from 'assert';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/*eslint-env mocha*/

describe('markdown-it-ruby', () => {
  const md = new MarkdownIt()
    .use(rubyPlugin);

  generate(join(__dirname, 'fixtures/ruby.txt'), md);

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
