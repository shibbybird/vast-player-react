'use strict';

import React from 'react';

function VideoSource({ media }) {
  return (
    <source src={media.getValue()} type={media.getAttr('type')} />
  );
}

VideoSource.propTypes = {
  media: React.PropTypes.object.isRequired,
};

export default VideoSource;
