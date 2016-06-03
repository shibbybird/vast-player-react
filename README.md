# VAST Player React Component

[![Build Status](https://travis-ci.org/shibbybird/vast-player-react.svg?branch=master)](https://travis-ci.org/shibbybird/vast-player-react)

This is the first function pass at a react component for playing vast ads. Inline linear ads are currently supported. Support for NonLinear ads coming soon.

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

## TODO
* Add Wrapper Support
* Add NonLinear Ad Support
* Icons Not Implements
* Lots of Attribute Odds and Ends Not Implemented
* Many More Things