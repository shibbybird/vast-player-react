'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import HTMLResource from '../lib/resources/html-resource.jsx';
import testUtil from '../test/test-util';
import assert from 'assert';
import jsdom from 'mocha-jsdom';
import fs from 'fs';
import Bluebird from 'bluebird';

const readFile = Bluebird.promisify(fs.readFile);

describe('HTML Resources', () => {

  jsdom();
  const app = testUtil.getExpressApp();
  let server = null;

  before(() => {
    server = app.listen(8080);
  });

  after(() => (
    server.close()
  ));

  it('validate dom', () => {
    let htmlResource = null;
    return testUtil.getTestXml('./test/data/inline-test.xml').then((json) => {
      const resource = json.vast.ad[0].inLine.creatives.creative[1].companionAds.companion[0];
      htmlResource = TestUtils.renderIntoDocument(
        <HTMLResource resource={resource.htmlResource[0]} />
      );
    })
    .delay(500)
    .then(() => (
      readFile('test/data/test-companion.html')
    ))
    .then((buf) => {
      const htmlResourceNode = ReactDom.findDOMNode(htmlResource);
      assert.equal(htmlResourceNode.innerHTML, buf.toString());
    });
  });
});
