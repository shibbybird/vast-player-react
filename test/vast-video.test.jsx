'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Linear from '../lib/linear/index.jsx';
import testUtil from '../test/test-util';
import assert from 'assert';
import Bluebird from 'bluebird';
import jsdom from 'mocha-jsdom';

describe('Video Player', () => {
  jsdom();
  const app = testUtil.getExpressApp();
  let server = null;
  let refs = null;
  let videoElement = null;
  let isCreativeView = false;
  let isStarted = false;
  let isFirstQuartile = false;
  let isMidPoint = false;
  let isThirdQuartile = false;
  let isCompleted = false;
  let isClickTracked = false;

  const stubbedVideoEnded = function () {
    return null;
  }

  class MockVideo extends React.Component {
    componentDidMount() {
      refs = this.refs['video-test'];
    }
    render() {
      return (
        <Linear
          ref="video-test"
          height={1080}
          width={1920}
          disableControls={this.props.disableControls}
          autoPlay={this.props.autoPlay}
          duration={this.props.duration}
          tracking={this.props.linear.trackingEvents.tracking}
          videoClicks={this.props.videoClicks}
          mediaFiles={this.props.linear.mediaFiles.mediaFile}
          onVideoEnded={stubbedVideoEnded}
        />
      );
    }

  }

  MockVideo.propTypes = {
    autoPlay: React.PropTypes.bool,
    disableControls: React.PropTypes.bool,
    linear: React.PropTypes.object.isRequired,
    videoClicks: React.PropTypes.object,
    duration: React.PropTypes.string,
  };

  before(() => {
    server = app.listen(8080);

    app.get('/creativeView', () => {
      isCreativeView = true;
    });

    app.get('/start', () => {
      isStarted = true;
    });

    app.get('/midpoint', () => {
      isMidPoint = true;
    });

    app.get('/firstQuartile', () => {
      isFirstQuartile = true;
    });

    app.get('/thirdQuartile', () => {
      isThirdQuartile = true;
    });

    app.get('/complete', () => {
      isCompleted = true;
    });

    app.get('/clickTracking', () => {
      isClickTracked = true;
    });

    return testUtil.getTestXml('./test/data/inline-test.xml').then((json) => {
      const linear = json.vast.ad[0].inLine.creatives.creative[0].linear;
      const disableControls = true;
      const autoPlay = true;
      const video = TestUtils.renderIntoDocument(
        <MockVideo
          disableControls={disableControls}
          autoPlay={autoPlay}
          linear={linear}
          videoClicks={linear.videoClicks}
          duration={'00:01:40.000'}
        />
      );
      videoElement = ReactDom.findDOMNode(video);
    })
    .delay(500);
  });

  after(() => (
    server.close()
  ));

  it('Validate Dom', () => {
    assert.equal(videoElement.getAttribute('preload'), 'auto');
    assert.equal(videoElement.tagName, 'VIDEO');
    assert.equal(videoElement.children.length, 1);
  });

  it('Error Wrong Media Type', () => (
    testUtil.getTestXml('./test/data/test-inline-error.xml').then((json) => {
      const linear = json.vast.ad[0].inLine.creatives.creative[0].linear;
      const mediaFile = linear.mediaFiles.mediaFile;
      const disableControls = true;
      const autoPlay = true;
      const vastVideo = TestUtils.renderIntoDocument(
        (<Linear
          key="new"
          height={1080}
          width={1920}
          disableControls={disableControls}
          autoPlay={autoPlay}
          duration={'00:01:40.000'}
          tracking={linear.trackingEvents.tracking}
          videoClicks={linear.videoClicks}
          mediaFiles={mediaFile}
          onVideoEnded={stubbedVideoEnded}
        />)
      );
      assert(!vastVideo, 'Vast Video instantiation should fail');
    }).catch((e) => {
      assert.equal(e.message, 'No Supported Video MIME Types');
    })
  ));

  it('Creative View tracking', () => (
    Bluebird.resolve(refs.timeUpdate({
      currentTarget: {
        currentTime: 1.00,
      },
    }))
    .delay(50)
    .then(() => (
      assert(isCreativeView, 'Creative View Tracking Did Not Fire')
    ))
  ));

  it('Start tracking', () => (
    Bluebird.resolve(refs.timeUpdate({
      currentTarget: {
        currentTime: 1.00,
      },
    }))
    .delay(50)
    .then(() => (
      assert(isStarted, 'Start Tracking Did Not Fire')
    ))
  ));

  it('First Quartile tracking', () => (
    Bluebird.resolve(refs.timeUpdate({
      currentTarget: {
        currentTime: 25.00,
      },
    }))
    .delay(50)
    .then(() => (
      assert(isFirstQuartile, 'First Quartile Tracking Did Not Fire')
    ))
  ));

  it('Mid Point tracking', () => (
    Bluebird.resolve(refs.timeUpdate({
      currentTarget: {
        currentTime: 50.00,
      },
    }))
    .delay(50)
    .then(() => (
      assert(isMidPoint, 'MidPoint Tracking Did Not Fire')
    ))
  ));

  it('Third Quartile tracking', () => (
    Bluebird.resolve(refs.timeUpdate({
      currentTarget: {
        currentTime: 75.00,
      },
    }))
    .delay(50)
    .then(() => (
      assert(isThirdQuartile, 'Third Quartile Tracking Did Not Fire')
    ))
  ));

  it('Complete tracking', () => (
    Bluebird.resolve(refs.onEnded())
    .delay(50)
    .then(() => (
      assert(isCompleted, 'Complete Tracking Did Not Fire')
    ))
  ));

  it('onClick tracking and routing', () => (
    Bluebird.resolve(refs.onClick())
    .delay(50)
    .then(() => {
      assert(isClickTracked, 'Click Tracking Did Not fire');
    })
  ));

  it('onClick no tracking and routing', () => (
    testUtil.getTestXml('./test/data/inline-test.xml').then((json) => {
      const linear = json.vast.ad[0].inLine.creatives.creative[0].linear;
      const disableControls = true;
      const autoPlay = true;
      TestUtils.renderIntoDocument(
        <MockVideo
          disableControls={disableControls}
          autoPlay={autoPlay}
          linear={linear}
          duration={'00:01:40'}
        />
      );
    })
    .delay(500)
    .then(() => {
      refs.onClick();
      assert(true);
    })
  ));

});
