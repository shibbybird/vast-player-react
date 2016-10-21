'use strict';

import ReactDOM from 'react-dom';
import React from 'react';
import VastPlayer from '../../index.js';
import axios from 'axios';

const videoOptions = {
  disableControls: true,
};

axios.get('../../test/data/inline-test.xml').then((xml) => (
    ReactDOM.render(
      <VastPlayer
        height={820}
        width={1280}
        vastXml={xml.data}
        videoOptions={videoOptions}
      />,
      document.getElementById('example')
    )
  )
);
