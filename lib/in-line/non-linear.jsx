import axios from 'axios';
import React from 'react';
import BaseResource from '../resources/base-resource';
import { getVastDurationInMillis } from '../helpers/duration';
import { getTracking } from '../helpers/tracking';

class NonLinear extends React.Component {
  constructor(props) {
    super(props);
    this.durationMillis = getVastDurationInMillis(this.props.duration);
    this.startTrackingArr = getTracking('start', this.props.tracking);
    this.completeTrackingArr = getTracking('complete', this.props.tracking);
  }

  componentDidMount() {
    this.onStartedTracking();
    setTimeout((e) => {
      this.onCompletedTracking();
      this.props.onEnded(e);
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
      <BaseResource
        baseResource={this.props.nonLinear}
        height={this.props.height}
        width={this.props.width}
      />
    );
  }
}

NonLinear.propTypes = {
  tracking: React.PropTypes.array,
  onEnded: React.PropTypes.func,
  nonLinear: React.PropTypes.object,
  height: React.PropTypes.number,
  width: React.PropTypes.number,
  duration: React.PropTypes.string,
};

export default NonLinear;
