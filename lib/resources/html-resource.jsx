'use strict';

import React from 'react';
import Bluebird from 'bluebird';
import axios from 'axios';
import { vastBaseStyle } from '../helpers/styles';

class HtmlResource extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      html: null,
      htmlSrc: this.props.resource.getValue(),
    };
  }

  componentDidMount() {
    Bluebird.resolve(axios.get(this.state.htmlSrc)).then((htmlStr) => {
      this.setState({
        html: { __html: htmlStr.data },
      });
    });
  }

  render() {
    return (
      <div
        style={vastBaseStyle}
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
