'use strict';
import axios from 'axios';
import React from 'react';
import BaseResource from '../resources/base-resource';
import { vastBaseStyle } from '../helpers/styles';
import { getVastDurationInMillis } from '../helpers/duration';
import { getTracking } from '../helpers/tracking';

class Companion extends React.Component {
  constructor(props) {
    super(props);
    this.durationMillis = getVastDurationInMillis(this.props.duration);
    this.startTrackingArr = getTracking('start', this.props.tracking);
    this.completeTrackingArr = getTracking('complete', this.props.tracking);
  }

  componentDidMount() {
    this.onStartedTracking();
    setTimeout(() => {
      this.onCompletedTracking();
    }, this.durationMillis);
  }

  onStartedTracking() {
    this.startTrackingArr.forEach((src) => {
      axios.get(src);
    });
  }

  onCompletedTracking() {
    this.completeTrackingArr.forEach((src) => {
      axios.get(src);
    });
  }

  render() {
    return (
      <div style={vastBaseStyle}>
        <BaseResource
          baseResource={this.props.companion}
          height={parseInt(this.props.companion.getAttr('height'), 10)}
          width={parseInt(this.props.companion.getAttr('width'), 10)}
        />
      </div>
    );
  }
}

Companion.propTypes = {
  companion: React.PropTypes.object.isRequired,
  duration: React.PropTypes.string,
  tracking: React.PropTypes.array,
};

export default Companion;
