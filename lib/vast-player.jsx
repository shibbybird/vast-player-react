'use strict';

import React from 'react';
import Inline from './in-line/index.jsx';
import styles from './css/style.css';
import vastXml from 'vast-xml-4';
import Bluebird from 'bluebird';
import _ from 'lodash';

let request;
try {
  request = require('browser-request');
} catch (e) {
  request = require('request');
}
const get = Bluebird.promisify(request);

class VastPlayer extends React.Component {

  constructor(props) {
    super(props);
    const vast = this.props.vastJson;
    let ads = null;
    let adCount = 0;

    // References to all Ads
    this.adRefs = [];

    if (vast) {
      ads = this.validateJson(this.props.vastJson);
      adCount = ads.length;
    } else if (!this.props.vastXml) {
      throw new Error('Pass either VAST XML or VAST JSON(from vast-xml-4 lib)');
    }

    this.state = {
      heightStr: `${this.props.height}px`,
      widthStr: `${this.props.width}px`,
      vast,
      adCount,
      index: 0,
      ads,
      isTrackingFired: false,
    };
  }

  componentDidMount() {
    if (!this.state.vast && this.props.vastXml) {
      vastXml.parse(this.props.vastXml).then((json) => {
        const ads = this.validateJson(json.vast);
        this.setState({
          vast: json.vast,
          ads,
          adCount: ads.length,
        });
      });
    }
    this.fireTracking();
  }

  componentDidUpdate() {
    this.fireTracking();
    this.adRefs[this.state.index].startVideo();
  }

  onEnded() {
    if (this.props.onEnded) {
      this.props.onEnded();
    }

    if ((this.state.index + 1) < this.state.adCount) {
      this.setState({
        index: (this.state.index + 1),
      });
    }
  }

  fireTracking() {
    if (!this.isTrackingFired && this.state.vast) {
      this.isTrackingFired = true;
      this.state.ads.forEach((ad) => {
        if (ad.inLine.impression) {
          ad.inLine.impression.forEach((pixel) => {
            get(pixel.getValue());
          });
        }

        if (ad.inLine.viewableImpression && ad.inLine.viewableImpression.viewUndetermined) {
          ad.inLine.viewableImpression.viewUndetermined.forEach((impression) => {
            get(impression.getValue());
          });
        }
      });
    }
  }

  validateJson(vastJson) {
    const ads = vastJson.ad.filter((a) => (!!a.inLine));
    if (vastJson.getAttr('version') !== '4.0') {
      throw new Error('React Vast Player only support VAST 4.0');
    }

    if (ads.length === 0) {
      throw new Error('No InLine Ads Found');
    }

    return ads;
  }

  render() {
    let renderable = null;
    if (this.state.vast) {
      renderable = this.state.ads.map((ad, idx) => {
        let className = null;
        const videoOptions = _.cloneDeep(this.props.videoOptions);

        if (idx !== this.state.index) {
          className = styles.hide;
          videoOptions.autoPlay = false;
        }

        if (this.state.index > 0) {
          videoOptions.autoPlay = false;
        }
        const onEnded = this.onEnded.bind(this);
        return (
          <div
            className={`${className} ${styles['vast-base']}`}
          >
            <Inline
              ref={(ref) => (this.adRefs.push(ref))}
              onEnded={onEnded}
              key={`inline-${idx}`}
              height={this.props.height}
              width={this.props.width}
              inLine={ad.inLine}
              videoOptions={videoOptions}
            />
          </div>
        );
      });
    }

    return (
      <div
        className={`${styles['vast-player']} ${styles['vast-base']}`}
        style={{
          height: this.state.heightStr,
          width: this.state.widthStr,
        }}
      >
        {renderable}
      </div>
    );
  }

}

VastPlayer.propTypes = {
  vastXml: React.PropTypes.string,
  vastJson: React.PropTypes.object,
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
  onEnded: React.PropTypes.func,
  videoOptions: React.PropTypes.object,
};

export default VastPlayer;
