'use strict';

import React from 'react';
import BaseResource from '../resources/base-resource.jsx';
import { vastBaseStyle } from '../helpers/styles';

function Companion({ companions }) {
  const htmls = companions.map((companion, key) => (
    <BaseResource
      key={key}
      baseResource={companion}
      height={parseInt(companion.getAttr('height'), 10)}
      width={parseInt(companion.getAttr('width'), 10)}
    />
  ));

  return (<div key={'companion-ads'} style={vastBaseStyle}>{htmls}</div>);
}

Companion.propTypes = {
  companions: React.PropTypes.array.isRequired,
};

export default Companion;
