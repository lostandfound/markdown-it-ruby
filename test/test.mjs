'use strict';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import generate from 'markdown-it-testgen';
import MarkdownIt from 'markdown-it';
import rubyPlugin from '../index.mjs';
import { describe } from 'mocha'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/*eslint-env mocha*/

describe('markdown-it-ruby', () => {
  const md = new MarkdownIt()
    .use(rubyPlugin);

  generate(join(__dirname, 'fixtures/ruby.txt'), md);
});
