'use strict';

import React from 'react';
import Inline from './in-line/index';
import vastXml from 'vast-xml-4';
import axios from 'axios';
import _ from 'lodash';
import { vastBaseStyle } from './helpers/styles';

const vastBase = JSON.parse(JSON.stringify(vastBaseStyle));

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
    if (this.adRefs[this.state.index]) {
      this.adRefs[this.state.index].startVideo();
    }
  }

  onEnded() {
    if ((this.state.index + 1) < this.state.adCount) {
      this.setState({
        index: (this.state.index + 1),
      });
    } else {
      if (this.props.onEnded) {
        this.props.onEnded();
      }
    }
  }

  fireTracking() {
    if (!this.isTrackingFired && this.state.vast) {
      this.isTrackingFired = true;
      this.state.ads.forEach((ad) => {
        if (ad.inLine.impression) {
          ad.inLine.impression.forEach((pixel) => {
            axios.get(pixel.getValue());
          });
        }

        if (ad.inLine.viewableImpression && ad.inLine.viewableImpression.viewUndetermined) {
          ad.inLine.viewableImpression.viewUndetermined.forEach((impression) => {
            axios.get(impression.getValue());
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
    const vastPlayerStyle = {
      backgroundColor: '#000000',
      height: this.state.heightStr,
      width: this.state.widthStr,
      ...vastBase,
    };
    if (this.state.vast) {
      renderable = this.state.ads.map((ad, idx) => {
        const videoOptions = _.cloneDeep(this.props.videoOptions);
        const style = {
          ...vastBase,
        };
        if (idx !== this.state.index) {
          style.display = 'none';
        }

        return (
          <div
            key={`inline-div-${idx}`}
            style={style}
          >
            <Inline
              ref={(ref) => (this.adRefs.push(ref))}
              onEnded={(e) => { this.onEnded(e); }}
              key={`inline-${idx}`}
              height={this.props.height}
              width={this.props.width}
              defaultDuration={this.props.defaultDuration}
              inLine={ad.inLine}
              videoOptions={videoOptions}
            />
          </div>
        );
      });
    }

    return (
      <div
        style={vastPlayerStyle}
      >
        {renderable}
      </div>
    );
  }

}

VastPlayer.propTypes = {
  vastXml: React.PropTypes.string,
  vastJson: React.PropTypes.object,
  defaultDuration: React.PropTypes.string,
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
  onEnded: React.PropTypes.func,
  videoOptions: React.PropTypes.object,
};

export default VastPlayer;
