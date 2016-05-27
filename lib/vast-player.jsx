'use strict';

import React from 'react';
import Inline from './in-line/index.jsx';
import styles from './css/style.css';

class VastPlayer extends React.Component {
  constructor(props) {
    super(props);
    const vast = this.props.vastJson;
    const ads = vast.ad.filter((a) => (!!a.inLine));
    if (this.props.vastJson.getAttr('version') !== '4.0') {
      throw new Error('React Vast Player only support VAST 4.0');
    }

    if (!ads) {
      throw new Error('No InLine Ads Found');
    }

    this.state = {
      vast,
      adCount: this.props.vastJson.ad.length,
      index: 0,
      ads,
    };
  }

  render() {
    const renderable = this.state.ads.map((ad) => (
      <Inline
        height={this.props.height}
        width={this.props.width}
        inLine={ad.inLine}
        videoOptions={this.props.videoOptions}
      />
    ));

    return (
      <div
        className={styles['vast-player']}
        style={{ height: this.props.height, width: this.props.width }}
      >
        {renderable}
      </div>
    );
  }

}

VastPlayer.propTypes = {
  vastJson: React.PropTypes.object.isRequired,
  height: React.PropTypes.string.isRequired,
  width: React.PropTypes.string.isRequired,
  videoOptions: React.PropTypes.object,
};

export default VastPlayer;
