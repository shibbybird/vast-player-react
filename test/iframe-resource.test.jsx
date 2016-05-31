'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import IFrameResource from '../lib/resources/iframe-resource.jsx';
import testUtil from '../test/test-util';
import assert from 'assert';
import jsdom from 'mocha-jsdom';

describe('IFrame Resources', () => {
  jsdom();
  it('validate dom', () => (
    testUtil.getTestXml('./test/data/inline-test.xml').then((json) => {
      const renderer = TestUtils.createRenderer();
      const resource = json.vast.ad[0].inLine.creatives.creative[1].companionAds.companion[1];

      const iFrame = renderer.render(
        <IFrameResource resource={resource.iFrameResource[0]} />
      );

      assert.equal(iFrame.type, 'iframe');
      assert.equal(iFrame.props.src, 'http://localhost:8080/test/data/test-iframe.html');
    })
  ));
});
