'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import StaticResource from '../lib/resources/static-resource.jsx';
import testUtil from '../test/test-util';
import assert from 'assert';
import jsdom from 'mocha-jsdom';

describe('Static Resources', () => {
  jsdom();
  it('validate dom', () => (
    testUtil.getTestXml('./test/data/inline-test.xml').then((json) => {
      const renderer = TestUtils.createRenderer();
      const resource = json.vast.ad[0].inLine.creatives.creative[1].companionAds.companion[2];

      const staticResources = resource.staticResource.map((staticResource) => (
        renderer.render(<StaticResource resource={staticResource} />)
      ));

      const image = staticResources[0];
      const js = staticResources[1];
      const css = staticResources[2];
      const notSupported = staticResources[3];

      assert.equal(image.type, 'img');
      assert.equal(image.props.src, 'http://localhost:8080/test/data/banner1280x100.png');
      assert.equal(css.type, 'link');
      assert.equal(css.props.href, 'http://localhost:8080/test/data/test-css.css');
      assert.equal(js.type, 'script');
      assert.equal(js.props.src, 'http://localhost:8080/test/data/test-alert.js');
      assert.equal(notSupported, null);
    })
  ));
});
