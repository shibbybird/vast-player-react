'use strict';

import React from 'react';

function StaticResource({ resource }) {
  const mimeType = resource.getAttr('creativeType');
  let renderable = null;

  if (mimeType.indexOf('image') === 0) {
    renderable = (<img role="presentation" src={resource.getValue()} />);
  } else if (mimeType.indexOf('text/css') === 0) {
    renderable = (
      <link
        rel="stylesheet"
        property="stylesheet"
        href={resource.getValue()}
      />
    );
  } else if (mimeType.indexOf('application/json') === 0) {
    renderable = (
      <script
        src={resource.getValue()}
      />
    );
  } else {
    console.warn('Static Resource Not Supported!');
  }

  return renderable;
}

StaticResource.propTypes = {
  resource: React.PropTypes.object.isRequired,
};

export default StaticResource;
