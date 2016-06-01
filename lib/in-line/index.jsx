'use strict';

import _ from 'lodash';
import React from 'react';
import VastVideo from '../video/index.jsx';
import Companion from './companion.jsx';
import styles from '../css/style.css';

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
    const videoOptions = _.merge({}, this.props.videoOptions);

    this.state = {
      linearAd,
      videoOptions,
      companionAds,
    };
  }

  onEnded() {
    this.props.onEnded();
  }

  startVideo() {
    this.vastVideoRef.startVideo();
  }

  render() {
    const linear = this.state.linearAd.linear;
    const companions = this.state.companionAds.map((creative, idx) => (
      <Companion
        key={`companion-${idx}`}
        companions={creative.companionAds.companion}
      />
    ));
    const onEnded = this.onEnded.bind(this);
    return (
      <div className={styles['vast-base']}>
        <VastVideo
          ref={(ref) => (this.vastVideoRef = ref)}
          onVideoEnded={onEnded}
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
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
  inLine: React.PropTypes.object.isRequired,
  onEnded: React.PropTypes.func.isRequired,
  videoOptions: React.PropTypes.object,
};

export default InLine;
