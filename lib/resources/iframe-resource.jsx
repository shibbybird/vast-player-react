'use strict';

import React from 'react';
import { vastBaseStyle } from '../helpers/styles';

function IFrameResource({ resource }) {
  return (
    <iframe
      style={vastBaseStyle}
      src={resource.getValue()}
    >
    </iframe>
  );
}

IFrameResource.propTypes = {
  resource: React.PropTypes.object.isRequired,
};

export default IFrameResource;
