/*'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import InLine from '../lib/in-line/index.jsx';
import testUtil from '../test/test-util';
import assert from 'assert';
import jsdom from 'mocha-jsdom';

describe('Companion Ads', () => {
  jsdom();
  it('check iframe src', () => (
    testUtil.getTestXml('./test/data/inline-test.xml').then((json) => {
      const renderer = TestUtils.createRenderer();
      const companions = json.vast.ad[0].inLine;

      const iFrame = renderer.render(
        <InLine companions={companions} />
      );

      assert.equal(iFrame.type, 'div');
      assert.equal(iFrame.props.children.length, 3);
    })
  ));
});
*/