'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import VideoSource from '../lib/video/source.jsx';
import testUtil from '../test/test-util';
import assert from 'assert';
import jsdom from 'mocha-jsdom';

describe('Video Source Resources', () => {
  jsdom();
  it('validate dom', () => (
    testUtil.getTestXml('./test/data/inline-test.xml').then((json) => {
      const renderer = TestUtils.createRenderer();
      const mediaFiles = json.vast.ad[0].inLine.creatives.creative[0].linear.mediaFiles.mediaFile;

      const videoSource = renderer.render(
        <VideoSource media={mediaFiles[0]} />
      );

      assert.equal(videoSource.type, 'source');
      assert.equal(videoSource.props.type, 'video/mp4');
      assert.equal(videoSource.props.src,
        'http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_720p_stereo.ogg');
    })
  ));
});
