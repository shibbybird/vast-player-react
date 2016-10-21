# VAST Player React Component

[![Build Status](https://travis-ci.org/shibbybird/vast-player-react.svg?branch=master)](https://travis-ci.org/shibbybird/vast-player-react)

This is the first functioning pass at a react component for playing vast ads including support for linear, and non linear ad types.

## Usage:

### XML Usage:

```
import VastPlayer from 'vast-player-react';

const videoOptions = {
  disableControls: true,
};

// Accepts a VAST 4.0 Ad
// Height and Width are for the Ad Placement
request('../../test/data/multi-ad.xml', (err, xml) => (
    ReactDOM.render(
      <VastPlayer
        height={1080}
        width={1920}
        vastXml={xml.body}
        videoOptions={videoOptions}
        onEnded={alertFinished}
      />,
      document.getElementById('example')
    )
  )
);
```

### JSON Usage:
You can use a json structure and pass it into the vastJson prop, however it will only accept a parsed VAST XML structure of the [vast-xml-4](https://www.npmjs.com/package/vast-xml-4) lib.

## Examples
```
npm run examples

// URL examples
// This just loads a bunch of static resource and plays a video
// (iframe not pointed at anything)
// http://localhost:8080/examples/full-page/index.html

// This has multiple ads but the urls are not
// pointed to videos open up the test/data/multi-ad.xml
// and replace the MediaFiles with Video URL'S
// http://localhost:8080/examples/multi-ad/index.html
```

## TODO
* Add Wrapper Support
* Icons Not Implements
* Lots of Attribute Odds and Ends Not Implemented
* Many More Things
