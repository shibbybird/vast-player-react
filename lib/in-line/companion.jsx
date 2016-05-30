'use strict';

import React from 'react';
import _ from 'lodash';
import { HtmlResource, StaticResource, IFrameResource } from '../resources';

class Companion extends React.Component {

  renderCompanion(companion) {
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
      width: `${companion.getAttr('width')}px;`,
    };

    return (
      <div
        style={divStyle}
      >
        {html}
      </div>
    );
  }

  render() {
    let htmls = [];
    _.each(this.props.companions, (companion) => {
      htmls = htmls.concat(this.renderCompanion(companion));
    });
    return <div>{htmls}</div>;
  }

}

Companion.propTypes = {
  companions: React.PropTypes.array.isRequired,
};

export default Companion;
