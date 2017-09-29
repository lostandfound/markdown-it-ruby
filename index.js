// Process {ruby base|ruby text}

'use strict';

function ddmd_ruby (state, silent) {

  var token,
      tokens,
      max = state.posMax,
      start = state.pos,
      devPos,
      closePos,
      baseText,
      rubyText,
      baseArray,
      rubyArray;

  if (silent) { return false; }
  if (state.src.charCodeAt(start) !== 0x7b/* { */) { return false; }
  if (start + 4 >= max) {return false; }

  state.pos = start + 1;

  while (state.pos < max) {

    if (devPos) {

      if (
        state.src.charCodeAt(state.pos) === 0x7D/* } */
        && state.src.charCodeAt(state.pos - 1) !== 0x5C/* \ */
      ) {
        closePos = state.pos;
        break;
      }

    } else if (state.src.charCodeAt(state.pos) === 0x7C/* | */ 
      && state.src.charCodeAt(state.pos - 1) !== 0x5C/* \ */) {
      devPos = state.pos;
    }

    state.pos++;
  }

  if (!closePos || start + 1 === state.pos) {
    state.pos = start;
    return false;
  }

  state.posMax = state.pos;
  state.pos = start + 1;

  token = state.push('ruby_open', 'ruby', 1);
  token.markup  = '{';

  baseText = state.src.slice(start + 1, devPos);
  rubyText = state.src.slice(devPos + 1, closePos);

  baseArray = baseText.split('');
  rubyArray = rubyText.split('|');

  if (baseArray.length === rubyArray.length) {

    baseArray.forEach(function(content, idx) {

      state.md.inline.parse(
        content,
        state.md,
        state.env,
        tokens = []
      );

      tokens.forEach(function(t) {
        state.tokens.push(t);
      });

      token = state.push('rt_open', 'rt', 1);

      state.md.inline.parse(
        rubyArray[idx],
        state.md,
        state.env,
        tokens = []
      );

      tokens.forEach(function(t) {
        state.tokens.push(t);
      });

      token = state.push('rt_close', 'rt', -1);

    });

  } else {

    state.md.inline.parse(
      baseText,
      state.md,
      state.env,
      tokens = []
    );

    tokens.forEach(function(t) {
      state.tokens.push(t);
    });

    token = state.push('rt_open', 'rt', 1);

    state.md.inline.parse(
      rubyText,
      state.md,
      state.env,
      tokens = []
    );

    tokens.forEach(function(t) {
      state.tokens.push(t);
    });

    token = state.push('rt_close', 'rt', -1);

  }

  token = state.push('ruby_close', 'ruby', -1);
  token.markup  = '}';

  state.pos = state.posMax + 1;
  state.posMax = max;

  return true;
}

module.exports = function ruby_plugin(md) {
  md.inline.ruler.before('text', 'ddmd_ruby', ddmd_ruby);
};
