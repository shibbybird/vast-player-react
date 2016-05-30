'use strict';

function noop() {
  return null;
}

require.extensions['.css'] = noop;
