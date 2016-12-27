import React from 'react';
import BaseResource from '../resources/base-resource';

function NonLinear({ height, width, nonLinear }) {
  return (
    <BaseResource
      baseResource={nonLinear}
      height={height}
      width={width}
    />
  );
}

NonLinear.propTypes = {
  nonLinear: React.PropTypes.object,
  height: React.PropTypes.number,
  width: React.PropTypes.number,
};

export default NonLinear;
