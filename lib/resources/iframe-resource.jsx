'use strict';

import React from 'react';

function IFrameResource({ resource }) {
  return (
    <iframe
      src={resource.getValue()}
    >
    </iframe>
  );
}

IFrameResource.propTypes = {
  resource: React.PropTypes.object.isRequired,
};

export default IFrameResource;
