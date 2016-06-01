'use strict';
import React from 'react';
import _ from 'lodash';
import Bluebird from 'bluebird';
import VideoSource from './source.jsx';
let request;

try {
  request = require('browser-request');
} catch (e) {
  request = require('request');
}
const get = Bluebird.promisify(request);

const VALID_MIME_TYPES = ['video/mp4', 'video/ogg', 'video/webm'];

class VastVideo extends React.Component {

  constructor(props) {
    super(props);
    const durationMillis = this.getDurationInMillis(this.props.duration);
    const quartile = (durationMillis / 4);
    const validMediaFiles = this.props.mediaFiles
      .filter((value) => (
        _.includes(VALID_MIME_TYPES, value.getAttr('type'))
      ));
    if (validMediaFiles.length === 0) {
      throw new Error('No Supported Video MIME Types');
    }

    this.state = {
      mediaFiles: validMediaFiles,
      tracking: {
        creativeView: this.getTracking('creativeView'),
        start: this.getTracking('start'),
        midpoint: this.getTracking('midpoint'),
        firstQuartile: this.getTracking('firstQuartile'),
        thirdQuartile: this.getTracking('thirdQuartile'),
        complete: this.getTracking('complete'),
      },
      duration: {
        millis: durationMillis,
        firstQuartile: Math.floor(quartile),
        midpoint: Math.floor(quartile * 2),
        thirdQuartile: Math.floor(quartile * 3),
      },
      completed: {
        creativeView: false,
        start: false,
        midpoint: false,
        firstQuartile: false,
        thirdQuartile: false,
        complete: false,
      },
    };
  }

  onClick() {
    const videoClicks = this.props.videoClicks;
    if (videoClicks) {
      _.each(videoClicks.clickTracking, (href) => {
        get(href.getValue());
      });
      window.open(videoClicks.clickThrough.getValue(), '_blank');
    }
  }

  onEnd(e) {
    get(this.state.tracking.complete);
    this.props.onVideoEnded(e);
  }

  getTracking(trackingName) {
    return _.find(this.props.tracking, (value) => (
          value.getAttr('event') === trackingName
        )).getValue();
  }

  getDurationInMillis(timeStr) {
    const arr = timeStr.split(':');
    const timeArr = arr.slice(0, 2).concat(arr[2].split('.')).map(parseFloat);
    const hours = timeArr[0];
    const minutes = timeArr[1];
    const seconds = timeArr[2];
    const milliseconds = timeArr.length > 3 ? timeArr[3] : 0;
    return (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
  }

  startVideo() {
    this.videoRef.currentTime = 0;
    this.videoRef.play();
  }

  timeUpdate(evt) {
    const currentTime = (evt.currentTarget.currentTime * 1000);
    const completed = this.state.completed;
    const tracking = this.state.tracking;
    const duration = this.state.duration;

    if (!completed.creativeView && tracking.creativeView) {
      get(tracking.creativeView);
      completed.creativeView = true;
    }
    if (!completed.start && tracking.start) {
      get(tracking.start);
      completed.start = true;
    }

    if (!completed.firstQuartile &&
      currentTime >= duration.firstQuartile) {
      get(tracking.firstQuartile);
      completed.firstQuartile = true;
    }

    if (!completed.midpoint &&
      currentTime >= duration.midpoint) {
      get(tracking.midpoint);
      completed.midpoint = true;
    }

    if (!completed.thirdQuartile &&
      currentTime >= duration.thirdQuartile) {
      get(tracking.thirdQuartile);
      completed.thirdQuartile = true;
    }
  }

  render() {
    const source = this.state.mediaFiles.map((media, idx) => (
      <VideoSource key={idx} media={media} />
    ));
    const timeUpdate = this.timeUpdate.bind(this);
    const onEnd = this.onEnd.bind(this);
    return (<video
      ref={(ref) => (this.videoRef = ref)}
      preload="auto"
      onTimeUpdate={timeUpdate}
      onClick={this.onClick}
      onEnded={onEnd}
      autoPlay={this.props.autoPlay}
      controls={!this.props.disableControls}
    >
      {source}
    </video>);
  }
}

VastVideo.propTypes = {
  disableControls: React.PropTypes.bool,
  autoPlay: React.PropTypes.bool,
  duration: React.PropTypes.string.isRequired,
  tracking: React.PropTypes.array.isRequired,
  videoClicks: React.PropTypes.object,
  mediaFiles: React.PropTypes.array.isRequired,
  onVideoEnded: React.PropTypes.func.isRequired,
};

export default VastVideo;
