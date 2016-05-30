'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import HTMLResource from '../lib/resources/html-resource.jsx';
import testUtil from '../test/test-util';
import assert from 'assert';
import jsdom from 'mocha-jsdom';

describe('HTML Companion Ads', () => {
  jsdom();

  it('check iframe src', () => (
    testUtil.getTestXml('./test/data/inline-test.xml').then((json) => {
      const resource = json.vast.ad[0].inLine.creatives.creative[1].companionAds.companion[0];
      console.log(resource.htmlResource[0]);
      const htmlResource = TestUtils.renderIntoDocument(
        <HTMLResource resource={resource.htmlResource[0]} />
      );
      const htmlResourceNode = ReactDom.findDOMNode(htmlResource);
      console.log(htmlResourceNode);
      assert.equal(htmlResource.type, 'div');

    })
  ));
});
