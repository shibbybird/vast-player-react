'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Companion from '../lib/in-line/companion.jsx';
import testUtil from '../test/test-util';
import assert from 'assert';
import jsdom from 'mocha-jsdom';

describe('Compaion Ads', () => {
  jsdom();
  const app = testUtil.getExpressApp();
  let server = null;
  let trackingCount = 0;
  let companionDocNode = null;
  before(() => {
    server = app.listen(8080);
    app.get('/companionTracking', () => {
      trackingCount++;
    });

    return testUtil.getTestXml('./test/data/inline-test.xml').then((json) => {
      const companions = json.vast.ad[0].inLine.creatives.creative[1].companionAds.companion;
      const companionDoc = TestUtils.renderIntoDocument(
        <Companion companions={companions} />
      );
      companionDocNode = ReactDom.findDOMNode(companionDoc);
    })
    .delay(500);
  });

  after(() => (
    server.close()
  ));

  it('Validate Dom', () => {
    assert.equal(companionDocNode.tagName, 'DIV');
    assert.equal(companionDocNode.children.length, 3);
  });

  it('Validate Tracking', () => {
    assert.equal(trackingCount, 2, 'Not All Companion Ads Didn\'t Track Correctly');
  });
});
