'use strict';

import ReactDOM from 'react-dom';
import React from 'react';
import VastPlayer from '../../index.js';
import axios from 'axios';

const videoOptions = {
  disableControls: true,
};

function alertFinished() {
  alert('Video Finished');
}

axios.get('../../test/data/multi-ad.xml').then((xml) => (
    ReactDOM.render(
      <VastPlayer
        height={1080}
        width={1920}
        vastXml={xml.data}
        videoOptions={videoOptions}
        onEnded={alertFinished}
      />,
      document.getElementById('example')
    )
  )
);
