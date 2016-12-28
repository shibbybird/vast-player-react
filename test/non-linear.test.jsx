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

describe('VAST non-linear', () => {
  jsdom();
  const app = testUtil.getExpressApp();
  let startedCount = 0;
  let completedCount = 0;
  let server;

  before((done) => {
    server = app.listen(8080, () => {
      done();
    });

    app.get('/non-linear/complete', (req, resp) => {
      completedCount++;
      resp.sendStatus(200);
    });

    app.get('/non-linear/start', (req, resp) => {
      startedCount++;
      resp.sendStatus(200);
    });
  });

  after(() => (server.close()));

  it('should display corrently and end', () => {
    let isEnded = false;
    return readFile('./test/data/non-linear-ad.xml')
    .then((xml) => {
      const nonLinear = TestUtils.renderIntoDocument(
        <VastPlayer
          vastXml={xml.toString()}
          height={1080}
          width={1920}
          onEnded={() => {
            isEnded = true;
          }}
        />
      );
      const vastPlayerDocNode = ReactDom.findDOMNode(nonLinear);
      assert.equal(vastPlayerDocNode.tagName, 'DIV');
      return Bluebird.delay(50)
      .then(() => {
        assert.equal(startedCount, 1, 'should have fired start tracking');
        assert.equal(completedCount, 0, 'should not have fired complete tracking');
        assert(!isEnded, 'should not have fired complete tracking');
        return Bluebird.delay(1000);
      })
      .then(() => {
        assert.equal(completedCount, 1, 'should have fired complete tracking');
        assert(isEnded, 'should have fired ended call when finished');
      });
    });
  });
});
