'use strict';

import _ from 'lodash';
import React from 'react';
import VastVideo from '../video/index.jsx';
import Companion from './companion.jsx';

class InLine extends React.Component {

  constructor(props) {
    super(props);
    const creatives = this.props.inLine.creatives.creative;
    const linearAd = _.find(creatives, (creative) =>
      (!!creative.linear)
    );
    const companionAds = _.filter(creatives, (creative) =>
      (!!creative.companionAds)
    );
    if (!linearAd) {
      throw new Error('Currently only support InLine Ads');
    }

    const videoOptions = _.merge({}, this.props.videoOptions);

    this.state = {
      linearAd,
      videoOptions,
      companionAds,
    };
  }

  render() {
    const linear = this.state.linearAd.linear;
    const companions = this.state.companionAds.map((creative) => (
      <Companion companions={creative.companionAds.companion} />
    ));
    return (
      <div>
        <VastVideo
          height={this.props.height}
          width={this.props.width}
          duration={linear.duration.getValue()}
          tracking={linear.trackingEvents.tracking}
          videoClicks={linear.videoClicks}
          mediaFiles={linear.mediaFiles.mediaFile}
          autoPlay={this.state.videoOptions.autoPlay}
          disableControls={this.state.videoOptions.disableControls}
        />
        {companions}
      </div>
    );
  }

}

InLine.propTypes = {
  height: React.PropTypes.string.isRequired,
  width: React.PropTypes.string.isRequired,
  inLine: React.PropTypes.object.isRequired,
  videoOptions: React.PropTypes.object,
};

export default InLine;
