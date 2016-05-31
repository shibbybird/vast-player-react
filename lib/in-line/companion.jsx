'use strict';

import React from 'react';
import { HtmlResource, StaticResource, IFrameResource } from '../resources';
import styles from '../css/style.css';
import Bluebird from 'bluebird';
let request;

try {
  request = require('browser-request');
} catch (e) {
  request = require('request');
}
const get = Bluebird.promisify(request);

class Companion extends React.Component {

  componentDidMount() {
    this.props.companions.forEach((companion) => {
      if (companion.trackingEvents) {
        companion.trackingEvents.tracking.forEach((track) => {
          const uri = track.getValue();
          get(uri);
        });
      }
    });
  }

  renderCompanion(companion, idx) {
    const html = [];

    if (companion.iFrameResource) {
      companion.iFrameResource.forEach((resource, index) => {
        const iFrameResource = (
          <IFrameResource
            resource={resource}
            key={`iframe-companion-${index}`}
          />
        );
        html.push(iFrameResource);
      });
    }

    if (companion.staticResource) {
      companion.staticResource.forEach((resource, index) => {
        const staticResource = (
          <StaticResource
            resource={resource}
            key={`static-companion-${index}`}
          />
        );
        html.push(staticResource);
      });
    }

    if (companion.htmlResource) {
      companion.htmlResource.forEach((resource, index) => {
        const htmlResource = (
          <HtmlResource
            resource={resource}
            key={`html-companion-${index}`}
          />
        );
        html.push(htmlResource);
      });
    }

    const divStyle = {
      height: `${companion.getAttr('height')}px`,
      width: `${companion.getAttr('width')}px`,
    };

    return (
      <div
        className={styles['vast-base']}
        style={divStyle}
        key={`companion-ad-${idx}`}
      >
        {html}
      </div>
    );
  }

  render() {
    let htmls = [];
    this.props.companions.forEach((companion, index) => {
      htmls = htmls.concat(this.renderCompanion(companion, index));
    });
    return <div className={styles['vast-base']} >{htmls}</div>;
  }

}

Companion.propTypes = {
  companions: React.PropTypes.array.isRequired,
};

export default Companion;
