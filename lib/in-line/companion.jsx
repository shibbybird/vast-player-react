'use strict';

import React from 'react';
import $ from 'jquery';
import Bluebird from 'bluebird';
import _ from 'lodash';

class Companion extends React.Component {

  constructor(props) {
    super(props);
    // TODO  Implement staticResource
    /*
    if (companion.staticResource) {
    }
    */

    const companions = this.props.companions;
    const htmlUrls = [];

    companions.forEach((companion) => {
      if (companion.htmlResource) {
        companion.htmlResource.forEach((htmlSrc) => {
          htmlUrls.push(htmlSrc.getValue());
        });
      }
    });

    this.state = {
      htmlUrls,
      renderedHtml: [],
    };
  }

  componentDidMount() {
    const promises = [];
    if (this.state.renderedHtml.length !== this.state.htmlUrls.length) {
      const htmlPromises = [];
      this.state.htmlUrls.forEach((url) => {
        htmlPromises.push(Bluebird.resolve($.get(url)));
      });
      promises.push(Bluebird.all(htmlPromises).bind(this).then((results) => {
        this.setState({
          renderedHtml: results.map((htmlStr) => ({ __html: htmlStr })),
        });
      }));
    }

    Bluebird.all(promises);
  }

  renderCompanion(companion) {
    const html = [];

    if (companion.iFrameResource) {
      companion.iFrameResource.forEach((src, index) => {
        const iframe = (
          <iframe
            src={src}
            key={`iframe-companion-${index}`}
          >
          </iframe>
        );
        html.push(Bluebird.resolve(iframe));
      });
    }

    if (this.state.renderedHtml.length > 0) {
      this.state.renderedHtml.forEach((htmlObj, index) => {
        const renderedHtml = (
          <div
            key={`html-companion-${index}`} 
            dangerouslySetInnerHTML={htmlObj}>
          </div>
        );
        html.push(renderedHtml);
      });
    }

    return html;
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
