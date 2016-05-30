'use strict';

import ReactDOM from 'react-dom';
import React from 'react';
import VastPlayer from '../../index.js';
import request from 'browser-request';

const videoOptions = {
  autoPlay: true,
  disableControls: true,
};

request('../../test/data/inline-test.xml', (err, xml) => (
    ReactDOM.render(
      <VastPlayer
        height={820}
        width={1280}
        vastXml={xml.body}
        videoOptions={videoOptions}
      />,
      document.getElementById('example')
    )
  )
);
