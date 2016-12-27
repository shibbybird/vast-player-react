'use strict';
import React from 'react';
import _ from 'lodash';
import VideoSource from './source';
import axios from 'axios';

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
        axios.get(href.getValue());
      });
      window.open(videoClicks.clickThrough.getValue(), '_blank');
    }
  }

  onEnded(e) {
    axios.get(this.state.tracking.complete);
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
    this.adTimeout = setTimeout(() => {
      this.onEnded();
    }, this.state.duration.millis);
  }

  timeUpdate(evt) {
    // Ad Timeout based on Ad length
    clearTimeout(this.adTimeout);
    const currentTime = (evt.currentTarget.currentTime * 1000);
    const completed = this.state.completed;
    const tracking = this.state.tracking;
    const duration = this.state.duration;

    if (!completed.creativeView && tracking.creativeView) {
      axios.get(tracking.creativeView);
      completed.creativeView = true;
    }
    if (!completed.start && tracking.start) {
      axios.get(tracking.start);
      completed.start = true;
    }

    if (!completed.firstQuartile &&
      currentTime >= duration.firstQuartile) {
      axios.get(tracking.firstQuartile);
      completed.firstQuartile = true;
    }

    if (!completed.midpoint &&
      currentTime >= duration.midpoint) {
      axios.get(tracking.midpoint);
      completed.midpoint = true;
    }

    if (!completed.thirdQuartile &&
      currentTime >= duration.thirdQuartile) {
      axios.get(tracking.thirdQuartile);
      completed.thirdQuartile = true;
    }
  }

  render() {
    let height = 0;
    let width = 0;
    let currentHeightDiff = Infinity;
    let currentWidthDiff = Infinity;
    const source = this.state.mediaFiles.map((media, idx) => {
      const mediaHeight = parseInt(media.getAttr('height'), 10);
      const mediaWidth = parseInt(media.getAttr('width'), 10);
      const heightDiff = Math.abs(mediaHeight - this.props.height);
      const widthDiff = Math.abs(mediaWidth - this.props.width);
      if ((heightDiff + widthDiff) < (currentHeightDiff + currentWidthDiff)) {
        currentHeightDiff = heightDiff;
        currentWidthDiff = widthDiff;
        height = mediaHeight;
        width = mediaWidth;
      }
      return (<VideoSource key={idx} media={media} />);
    });

    return (<video
      height={`${height}px`}
      width={`${width}px`}
      ref={(ref) => (this.videoRef = ref)}
      preload="auto"
      onTimeUpdate={(e) => { this.timeUpdate(e); }}
      onClick={(e) => { this.onClick(e); }}
      onEnded={(e) => { this.onEnded(e); }}
      controls={!this.props.disableControls}
    >
      {source}
    </video>);
  }
}

VastVideo.propTypes = {
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
  disableControls: React.PropTypes.bool,
  duration: React.PropTypes.string.isRequired,
  tracking: React.PropTypes.array.isRequired,
  videoClicks: React.PropTypes.object,
  mediaFiles: React.PropTypes.array.isRequired,
  onVideoEnded: React.PropTypes.func.isRequired,
};

export default VastVideo;
