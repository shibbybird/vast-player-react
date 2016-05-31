'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import InLine from '../lib/in-line/index.jsx';
import testUtil from '../test/test-util';
import assert from 'assert';
import jsdom from 'mocha-jsdom';

describe('Inline', () => {
  jsdom();
  const app = testUtil.getExpressApp();
  let server = null;
  let inLineDocNode = null;

  before(() => {
    server = app.listen(8080);
    return testUtil.getTestXml('./test/data/inline-test.xml').then((json) => {
      const inLine = json.vast.ad[0].inLine;
      const videoOptions = {
        autoPlay: true,
      };
      const inlineDoc = TestUtils.renderIntoDocument(
        <InLine
          inLine={inLine}
          height={400}
          width={600}
          videoOptions={videoOptions}
        />
      );
      inLineDocNode = ReactDom.findDOMNode(inlineDoc);
    })
    .delay(500);
  });

  after(() => (
    server.close()
  ));

  it('Validate Dom', () => {
    assert.equal(inLineDocNode.tagName, 'DIV');
    assert.equal(inLineDocNode.children[0].tagName, 'VIDEO', 'Inline Video Element');
    assert.equal(inLineDocNode.children[1].tagName, 'DIV', 'Companion DIV Container');
  });
});
