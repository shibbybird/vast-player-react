'use strict';

import React from 'react';
import $ from 'jquery';
import Bluebird from 'bluebird';

class HtmlResource extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      html: null,
      htmlSrc: this.props.resource.getValue(),
    };
  }

  componentDidMount() {
    Bluebird.resolve($.get(this.state.htmlSrc)).bind(this).then((htmlStr) => {
      console.log(htmlStr);
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
};

export default HtmlResource;
