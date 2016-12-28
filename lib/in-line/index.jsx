'use strict';

import _ from 'lodash';
import React from 'react';
import Linear from '../linear/index';
import NonLinear from './non-linear';
import Companion from './companion';
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
    let companionAds = _.find(creatives, (creative) =>
      (!!creative.companionAds)
    );
    const videoOptions = _.merge({}, this.props.videoOptions);
    if (companionAds) {
      companionAds = companionAds.companionAds;
    }
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
          tracking={linear.trackingEvents ? linear.trackingEvents.tracking : []}
          videoClicks={linear.videoClicks}
          mediaFiles={linear.mediaFiles.mediaFile}
          disableControls={this.state.videoOptions.disableControls}
        />
      );
    } else if (this.state.nonLinearAds && this.state.nonLinearAds.nonLinear) {
      const nonLinears = this.state.nonLinearAds.nonLinear;
      linearOrNonLinear = nonLinears.map((nonLinear, key) => {
        let duration = 0;
        let tracking = [];
        let onEnded = () => {};
        if (key === 0) {
          duration = this.state.nonLinearAds.duration
            ? this.state.nonLinearAds.duration.getValue()
            : this.props.defaultDuration || undefined;
          tracking = this.state.nonLinearAds.trackingEvents ?
            this.state.nonLinearAds.trackingEvents.tracking : [];
          onEnded = (e) => { this.onEnded(e); };
        }
        return (<NonLinear
          key={`linear-ad-${key}`}
          nonLinear={nonLinear}
          onEnded={onEnded}
          duration={duration}
          height={this.props.height}
          tracking={tracking}
          width={this.props.width}
        />);
      });
    }
    let companions = null;
    if (this.state.companionAds) {
      companions = this.state.companionAds.companion.map((companion, idx) => {
        const duration = this.state.companionAds.duration
          ? this.state.companionAds.duration.getValue()
          : undefined;
        return (
          <Companion
            key={`companion-${idx}`}
            duration={duration}
            tracking={companion.trackingEvents ?
              companion.trackingEvents.tracking : []
            }
            companion={companion}
          />
        );
      });
    }

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
  defaultDuration: React.PropTypes.string,
};

export default InLine;
