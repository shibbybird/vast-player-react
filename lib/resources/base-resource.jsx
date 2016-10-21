'use strict';

import React from 'react';
import { HtmlResource, StaticResource, IFrameResource } from './index.js';
import axios from 'axios';
import { vastBaseStyle } from '../helpers/styles';

class BaseResource extends React.Component {

  componentDidMount() {
    const baseResource = this.props.baseResource;
    if (baseResource.trackingEvents) {
      baseResource.trackingEvents.tracking.forEach((track) => {
        const uri = track.getValue();
        axios.get(uri);
      });
    }
  }

  render() {
    const baseResource = this.props.baseResource;
    const html = [];
    if (baseResource.iFrameResource) {
      baseResource.iFrameResource.forEach((resource, index) => {
        const iFrameResource = (
          <IFrameResource
            resource={resource}
            key={`iframe-companion-${index}`}
          />
        );
        html.push(iFrameResource);
      });
    }

    if (baseResource.staticResource) {
      baseResource.staticResource.forEach((resource, index) => {
        const staticResource = (
          <StaticResource
            resource={resource}
            key={`static-companion-${index}`}
          />
        );
        html.push(staticResource);
      });
    }

    if (baseResource.htmlResource) {
      baseResource.htmlResource.forEach((resource, index) => {
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
      height: `${this.props.height}px`,
      width: `${this.props.width}px`,
      ...vastBaseStyle,
    };

    return (
      <div style={divStyle}>
        {html}
      </div>
    );
  }

}

BaseResource.propTypes = {
  baseResource: React.PropTypes.object.isRequired,
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
};

export default BaseResource;
