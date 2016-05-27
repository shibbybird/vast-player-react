'use strict';

import ReactDOM from 'react-dom';
import React from 'react';
import VastPlayer from '../../index.js';
import vastXML from 'vast-xml-4';
import $ from 'jquery';

const videoOptions = {
  autoPlay: true,
  disableControls: true,
};

$.get('../../__tests__/test-data/inline-test.xml', (xml) => (
  vastXML.parse(new XMLSerializer().serializeToString(xml)).bind(this).then((json) => {
    ReactDOM.render(
      <VastPlayer
        height="820px"
        width="1280px"
        vastJson={json.vast}
        videoOptions={videoOptions}
      />,
      document.getElementById('example')
    );
  })
));
