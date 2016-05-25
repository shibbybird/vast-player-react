'use strict';

import _ from 'lodash';
import React from 'react';
import VastVideo from '../video/index.jsx';

class InLine extends React.Component {

  constructor(props) {
    super(props);
    const creatives = this.props.inLine.creatives.creative;
    const linearAd = _.find(creatives, (creative) =>
      (!!creative.linear)
    );
    const companionAds = _.find(creatives, (creative) =>
      (!!creative.companionAds)
    );
    if (!linearAd) {
      throw new Error('Currently only support InLine Ads');
    }
    this.state = {
      linearAd,
      companionAds: companionAds.companion,
    };
  }

  render() {
    const linear = this.state.linearAd.linear;
    return (
      <div>
        <VastVideo
          height={this.props.height}
          width={this.props.width}
          duration={linear.duration.getValue()}
          tracking={linear.trackingEvents.tracking}
          videoClicks={linear.videoClicks}
          mediaFiles={linear.mediaFiles.mediaFile}
        />
      </div>
    );
  }

}

InLine.propTypes = {
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
  inLine: React.PropTypes.object.isRequired,
};

export default InLine;
