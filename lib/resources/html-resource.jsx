'use strict';

import React from 'react';
import Bluebird from 'bluebird';
let request;
try {
  request = require('browser-request');
} catch (e) {
  request = require('request');
}
const get = Bluebird.promisify(request);

class HtmlResource extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      html: null,
      htmlSrc: this.props.resource.getValue(),
    };
  }

  componentDidMount() {
    Bluebird.resolve(get(this.state.htmlSrc)).bind(this).then((htmlStr) => {
      this.setState({
        html: { __html: htmlStr },
      });
    });
  }

  render() {
    return (
      <div
        dangerouslySetInnerHTML={this.state.html}
      >
      </div>
    );
  }

}

HtmlResource.propTypes = {
  resource: React.PropTypes.object.isRequired,
  request: React.PropTypes.object,
};

export default HtmlResource;
