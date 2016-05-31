'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Companion from '../lib/in-line/companion.jsx';
import testUtil from '../test/test-util';
import assert from 'assert';
import jsdom from 'mocha-jsdom';

describe('Companion Ads', () => {
  jsdom();
  it('check iframe src', () => (
    testUtil.getTestXml('./test/data/inline-test.xml').then((json) => {
      const renderer = TestUtils.createRenderer();
      const companions = json.vast.ad[0].inLine.creatives.creative[1].companionAds.companion;

      const iFrame = renderer.render(
        <Companion companions={companions} />
      );

      assert.equal(iFrame.type, 'div');
      assert.equal(iFrame.props.children.length, 3);
    })
  ));
});
