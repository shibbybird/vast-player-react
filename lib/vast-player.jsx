'use strict';

import React from 'react';
import Inline from './in-line/index.jsx';

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

  renderInline(inLine) {
    return (
      <div>
        <Inline
          height={this.props.height}
          width={this.props.width}
          inLine={inLine}
        />
      </div>
    );
  }

  render() {
    const renderable = this.state.ads.map((ad) => (
      <Inline
        height={this.props.height}
        width={this.props.width}
        inLine={ad.inLine}
      />
    ));

    return (<div>{renderable}</div>);
  }

}

VastPlayer.propTypes = {
  vastJson: React.PropTypes.object.isRequired,
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
};

export default VastPlayer;
