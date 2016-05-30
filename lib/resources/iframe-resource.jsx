'use strict';

import React from 'react';
import styles from '../css/style.css';

function IFrameResource({ resource }) {
  return (
    <iframe
      className={styles['vast-base']}
      src={resource.getValue()}
    >
    </iframe>
  );
}

IFrameResource.propTypes = {
  resource: React.PropTypes.object.isRequired,
};

export default IFrameResource;
