'use strict';

import ReactDOM from 'react-dom';
import React from 'react';
import VastPlayer from '../../index.js';
import $ from 'jquery';

const videoOptions = {
  autoPlay: true,
  disableControls: true,
};

$.get('../../test-data/inline-test.xml', (xml) => (
    ReactDOM.render(
      <VastPlayer
        height="820px"
        width="1280px"
        vastXml={new XMLSerializer().serializeToString(xml)}
        videoOptions={videoOptions}
      />,
      document.getElementById('example')
    )
  )
);
