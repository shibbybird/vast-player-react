'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import VastPlayer from '../lib/vast-player.jsx';
import testUtil from '../test/test-util';
import assert from 'assert';
import jsdom from 'mocha-jsdom';
import Bluebird from 'bluebird';
import fs from 'fs';

const readFile = Bluebird.promisify(fs.readFile);

describe('VAST Player', () => {
  jsdom();
  const app = testUtil.getExpressApp();
  let server = null;
  let isNotDeterminedFired = false;
  let isImpressionFired = false;

  before(() => {
    server = app.listen(8080);

    app.get('/notDetermined', () => {
      isNotDeterminedFired = true;
    });

    app.get('/impression', () => {
      isImpressionFired = true;
    });
  });

  after(() => (
    server.close()
  ));

  function validateDom(vastPlayerDocNode) {
    assert.equal(vastPlayerDocNode.tagName, 'DIV');
    assert.equal(vastPlayerDocNode.style.height, '400px');
    assert.equal(vastPlayerDocNode.style.width, '600px');
    assert.equal(vastPlayerDocNode.children[0].tagName, 'DIV', 'Inline Video Element');
    assert.equal(vastPlayerDocNode.children.length, 1);
  }

  it('Validate DOM With XML', () => {
    let vastPlayerDocNode = null;
    return readFile('./test/data/inline-test.xml').then((xml) => {
      const videoOptions = {
        autoPlay: true,
        disableControls: true,
      };
      const inlineDoc = TestUtils.renderIntoDocument(
        <VastPlayer
          vastXml={xml.toString()}
          height={400}
          width={600}
          videoOptions={videoOptions}
        />
      );
      vastPlayerDocNode = ReactDom.findDOMNode(inlineDoc);
    })
    .delay(500)
    .then(() => (
      validateDom(vastPlayerDocNode)
    ));
  });

  it('Validate DOM With JSON', () => {
    let vastPlayerDocNode = null;
    return testUtil.getTestXml('./test/data/test-inline-no-impression.xml').then((json) => {
      const videoOptions = {
        autoPlay: true,
        disableControls: true,
      };
      const inlineDoc = TestUtils.renderIntoDocument(
        <VastPlayer
          vastJson={json.vast}
          height={400}
          width={600}
          videoOptions={videoOptions}
        />
      );
      vastPlayerDocNode = ReactDom.findDOMNode(inlineDoc);
    })
    .delay(100)
    .then(() => (
      validateDom(vastPlayerDocNode)
    ));
  });

  it('Error When No JSON or XML Is Passed', () => {
    try {
      const videoOptions = {
        autoPlay: true,
        disableControls: true,
      };
      const inlineDoc = TestUtils.renderIntoDocument(
        <VastPlayer
          height={400}
          width={600}
          videoOptions={videoOptions}
        />
      );
      assert(!inlineDoc, 'This should error as a result of no JSON or XML Data');
    } catch (e) {
      assert.equal(e.message, 'Pass either VAST XML or VAST JSON(from vast-xml-4 lib)');
    }
  });

  it('Erron On Incompatible Version', () => (
    testUtil.getTestXml('./test/data/test-inline-error.xml').then((json) => {
      const videoOptions = {
        autoPlay: true,
        disableControls: true,
      };
      const inlineDoc = TestUtils.renderIntoDocument(
        <VastPlayer
          vastJson={json.vast}
          height={400}
          width={600}
          videoOptions={videoOptions}
        />
      );
      assert(!inlineDoc, 'This Should Fail Due to Version Number');
    })
    .delay(100)
    .catch((e) => (
      assert.equal(e.message, 'React Vast Player only support VAST 4.0')
    ))
  ));

  it('Error On Wrapper Ads', () => (
    testUtil.getTestXml('./test/data/wrapper-test.xml').then((json) => {
      const videoOptions = {
        autoPlay: true,
        disableControls: true,
      };
      const inlineDoc = TestUtils.renderIntoDocument(
        <VastPlayer
          vastJson={json.vast}
          height={400}
          width={600}
          videoOptions={videoOptions}
        />
      );
      assert(!inlineDoc, 'This is a unsupported wrapper ad');
    })
    .delay(100)
    .catch((e) => (
      assert.equal(e.message, 'No InLine Ads Found')
    ))
  ));

  // TODO this is lazy and require other tests before it works
  // if it errors it's because someone removed or changed above tests
  it('Impressions Fired', () => {
    assert(isImpressionFired, 'Impression Did Not Fire');
    assert(isNotDeterminedFired, 'Viewable Impression Not Determined Did Not Fire');
  });

});
