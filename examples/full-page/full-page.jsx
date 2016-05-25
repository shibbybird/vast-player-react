'use strict';

import ReactDOM from 'react-dom';
import React from 'react';
import VastPlayer from '../../lib/vast-player.jsx';
import vastXML from 'vast-xml-4';
import $ from 'jquery';

$.get('../../__tests__/test-data/inline-test.xml', (xml) => (
  vastXML.parse(new XMLSerializer().serializeToString(xml)).bind(this).then((json) => {
    ReactDOM.render(
      <VastPlayer height={720} width={1280} vastJson={json.vast} />,
      document.getElementById('example')
    );
  })
));
