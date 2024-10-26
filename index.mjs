// Process {ruby base|ruby text}

/**
 * Parses and processes custom ruby annotation syntax within a Markdown string.
 * 
 * This function identifies and processes text wrapped in curly braces `{}` 
 * with a vertical bar `|` separating the base text and the ruby text. 
 * It then generates the appropriate tokens for rendering ruby annotations.
 * 
 * @param {Object} state - The state object of the Markdown parser.
 * @param {boolean} silent - If true, the function will not produce any tokens.
 * @returns {boolean} - Returns true if the ruby annotation was successfully parsed, otherwise false.
 */
function ddmd_ruby (state, silent) {
  // Validate rp option
  const rp = Array.isArray(state.md.ddmdOptions.rp) && 
    state.md.ddmdOptions.rp.length === 2 && 
    typeof state.md.ddmdOptions.rp[0] === 'string' && 
    typeof state.md.ddmdOptions.rp[1] === 'string'
    ? state.md.ddmdOptions.rp
    : ["", ""];

  // Only output rp elements if both opening and closing parentheses are non-empty
  const [rpOpen, rpClose] = rp;
  const shouldOutputRp = rpOpen !== "" && rpClose !== "";

  // Initialize required variables
  const max = state.posMax;
  const start = state.pos;
  let token,
      tokens,
      devPos,     // Position of delimiter '|'
      closePos,   // Position of closing character '}'
      baseText,   // Base text to apply ruby to
      rubyText,   // Ruby text to be displayed above
      baseArray,  // Array of base text characters
      rubyArray;  // Array of ruby text segments

  // Exit if in silent mode or invalid starting character
  if (silent) { return false; }
  if (state.src.charCodeAt(start) !== 0x7b/* { */) { return false; }
  if (start + 4 >= max) { return false; }

  // Scan text to find delimiter and closing positions
  state.pos = start + 1;
  while (state.pos < max) {
    if (devPos) {
      // After finding delimiter, look for closing character
      if (
        state.src.charCodeAt(state.pos) === 0x7D/* } */
        && state.src.charCodeAt(state.pos - 1) !== 0x5C/* \ */
      ) {
        closePos = state.pos;
        break;
      }
    } else if (state.src.charCodeAt(state.pos) === 0x7C/* | */ 
      && state.src.charCodeAt(state.pos - 1) !== 0x5C/* \ */) {
      // Find non-escaped delimiter
      devPos = state.pos;
    }
    state.pos++;
  }

  if (!devPos) {
    state.pos = start;
    return false; // Delimiter '|' not found
  }
  if (!closePos) {
    state.pos = start;
    return false; // Closing brace '}' not found
  }
  if (start + 1 === state.pos) {
    state.pos = start;
    return false; // Empty content
  }

  state.posMax = state.pos;
  state.pos = start + 1;

  token = state.push('ruby_open', 'ruby', 1);
  token.markup = '{';

  // Extract base text and ruby text
  baseText = state.src.slice(start + 1, devPos);
  rubyText = state.src.slice(devPos + 1, closePos);

  // Split texts into arrays
  baseArray = Array.from(baseText); // Use Array.from for Unicode support

  // Add length check for rubyArray
  if (rubyText.includes('|')) {
    rubyArray = rubyText.split('|').filter(text => text.length > 0);
    if (rubyArray.length === 0) {
      state.pos = start;
      return false;
    }
  } else {
    rubyArray = [rubyText];
  }

  // Common function for token generation
  function parseAndPushTokens(content) {
    const tokens = [];
    state.md.inline.parse(content, state.md, state.env, tokens);
    tokens.forEach(t => state.tokens.push(t));
  }

  // Optimize character-by-character ruby processing
  if (baseArray.length === rubyArray.length) {
    baseArray.forEach((content, idx) => {
      parseAndPushTokens(content);
      
      if (shouldOutputRp) {
        // Generate opening rp token
        token = state.push('rp_open', 'rp', 1);
        token.content = rpOpen;
        token.markup = rpOpen;
      }
      
      token = state.push('rt_open', 'rt', 1);
      parseAndPushTokens(rubyArray[idx]);
      token = state.push('rt_close', 'rt', -1);
      
      if (shouldOutputRp) {
        // Generate closing rp token
        token = state.push('rp_close', 'rp', 1);
        token.content = rpClose;
        token.markup = rpClose;
      }
    });
  } else {
    // Whole-text ruby: Apply single ruby text to entire base text
    state.md.inline.parse(
      baseText,
      state.md,
      state.env,
      tokens = []
    );

    tokens.forEach(function(t) {
      state.tokens.push(t);
    });

    if (shouldOutputRp) {
      // Generate opening rp token
      token = state.push('rp_open', 'rp', 1);
      token.content = rpOpen;
      token.markup = rpOpen;
    }

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

    if (shouldOutputRp) {
      // Generate closing rp token
      token = state.push('rp_close', 'rp', 1);
      token.content = rpClose;
      token.markup = rpClose;
    }
  }

  // Close ruby element
  token = state.push('ruby_close', 'ruby', -1);
  token.markup = '}';

  // Update parser position
  state.pos = state.posMax + 1;
  state.posMax = max;

  return true;
}

export default (md, options = {}) => {
  // Merge default options with user-provided options
  const ddmdOptions = Object.assign({
    // Define default settings
    rp: [] // rp element
  }, options);
  
  // Add options to markdown-it instance
  md.ddmdOptions = ddmdOptions;

  // Add rendering rules for rp elements
  md.renderer.rules.rp_open = function(tokens, idx) {
    return `<rp>${tokens[idx].content}</rp>`;
  };

  md.renderer.rules.rp_close = function(tokens, idx) {
    return `<rp>${tokens[idx].content}</rp>`;
  };

  md.inline.ruler.before('text', 'ddmd_ruby', ddmd_ruby);
};
