'use strict';

jest.unmock('../lib/vast-player.jsx');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import VastPlayer from '../lib/vast-player.jsx';

describe('VastPlayer', () => {
  it('Vast Player Test', () => {
    // Render a checkbox with label in the document
    const vastPlayer = TestUtils.renderIntoDocument(
      <VastPlayer test="dude" />
    );
    const vastPlayerNode = ReactDOM.findDOMNode(vastPlayer);
    expect(vastPlayerNode.textContent).toEqual('dude');
  });
});
