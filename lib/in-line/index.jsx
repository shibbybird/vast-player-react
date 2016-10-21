'use strict';

import _ from 'lodash';
import React from 'react';
import Linear from '../linear/index.jsx';
import NonLinear from './non-linear.jsx';
import Companion from './companion.jsx';
import { vastBaseStyle } from '../helpers/styles';

class InLine extends React.Component {

  constructor(props) {
    super(props);
    const creatives = this.props.inLine.creatives.creative;
    const linearAd = _.find(creatives, (creative) =>
      (!!creative.linear)
    );
    let nonLinearAds;
    const nonLinear = _.find(creatives, (creative) =>
      (!!creative.nonLinearAds)
    );
    if (nonLinear) {
      nonLinearAds = nonLinear.nonLinearAds;
    }
    const companionAds = _.filter(creatives, (creative) =>
      (!!creative.companionAds)
    );
    const videoOptions = _.merge({}, this.props.videoOptions);

    this.state = {
      linearAd,
      nonLinearAds,
      videoOptions,
      companionAds,
    };
  }

  onEnded() {
    this.props.onEnded();
  }

  startVideo() {
    if (this.vastVideoRef) {
      this.vastVideoRef.startVideo();
    }
  }

  render() {
    let linearOrNonLinear;
    if (this.state.linearAd && this.state.linearAd.linear) {
      const linear = this.state.linearAd.linear;
      linearOrNonLinear = (
        <Linear
          ref={(ref) => (this.vastVideoRef = ref)}
          onVideoEnded={(e) => { this.onEnded(e); }}
          height={this.props.height}
          width={this.props.width}
          duration={linear.duration.getValue()}
          tracking={linear.trackingEvents.tracking}
          videoClicks={linear.videoClicks}
          mediaFiles={linear.mediaFiles.mediaFile}
          disableControls={this.state.videoOptions.disableControls}
        />
      );
    } else if (this.state.nonLinearAds && this.state.nonLinearAds.nonLinear) {
      const nonLinears = this.state.nonLinearAds.nonLinear;
      linearOrNonLinear = nonLinears.map((nonLinear, key) => (
        <NonLinear
          key={`linear-ad-${key}`}
          nonLinear={nonLinear}
          height={this.props.height}
          width={this.props.width}
        />
      ));
    }
    const companions = this.state.companionAds.map((creative, idx) => (
      <Companion
        key={`companion-${idx}`}
        companions={creative.companionAds.companion}
      />
    ));

    return (
      <div style={vastBaseStyle}>
        {linearOrNonLinear}
        {companions}
      </div>
    );
  }

}

InLine.propTypes = {
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
  inLine: React.PropTypes.object.isRequired,
  onEnded: React.PropTypes.func.isRequired,
  videoOptions: React.PropTypes.object,
};

export default InLine;
