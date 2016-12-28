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
  let companionDocNode = null;
  let startedCount = 0;
  let completedCount = 0;
  before(() => {
    server = app.listen(8080);
    app.get('/start', () => {
      startedCount++;
    });

    app.get('/complete', () => {
      completedCount++;
    });

    return testUtil.getTestXml('./test/data/inline-test.xml').then((json) => {
      const companionAds = json.vast.ad[0].inLine.creatives.creative[1].companionAds;
      const companions = companionAds.companion;
      const companionDom = companions.map((comp, key) => {
        return (<Companion
          key={`dude-${key}`}
          duration={companionAds.duration.getValue()}
          tracking={(comp.trackingEvents ?
              comp.trackingEvents.tracking : [])}
          companion={comp}
        />);
      });
      const companionDoc = TestUtils.renderIntoDocument(
        <div>{companionDom}</div>
      );
      companionDocNode = ReactDom.findDOMNode(companionDoc);
    }).delay(1050);
  });

  after(() => (
    server.close()
  ));

  it('Validate Dom', () => {
    assert.equal(companionDocNode.tagName, 'DIV');
    assert.equal(companionDocNode.children.length, 3);
  });

  it('Validate Tracking', () => {
    assert.equal(startedCount, 2);
    assert.equal(completedCount, 1);
  });
});
