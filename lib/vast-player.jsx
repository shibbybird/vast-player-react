'use strict';

import React from 'react';
import Inline from './in-line/index.jsx';
import styles from './css/style.css';
import vastXml from 'vast-xml-4';

class VastPlayer extends React.Component {

  constructor(props) {
    super(props);
    const vast = this.props.vastJson;
    let ads = null;
    let adCount = 0;

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
  }

  validateJson(vastJson) {
    const ads = vastJson.ad.filter((a) => (!!a.inLine));
    if (vastJson.getAttr('version') !== '4.0') {
      throw new Error('React Vast Player only support VAST 4.0');
    }

    if (!ads) {
      throw new Error('No InLine Ads Found');
    }

    return ads;
  }

  render() {
    let renderable = null;
    if (this.state.vast) {
      renderable = this.state.ads.map((ad) => (
        <Inline
          height={this.props.height}
          width={this.props.width}
          inLine={ad.inLine}
          videoOptions={this.props.videoOptions}
        />
      ));
    }

    return (
      <div
        className={styles['vast-player']}
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
  videoOptions: React.PropTypes.object,
};

export default VastPlayer;
