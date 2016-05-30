'use strict';

import vastXml from 'vast-xml-4';
import Bluebird from 'bluebird';
import fs from 'fs';

const fsReadFile = Bluebird.promisify(fs.readFile);
const express = require('express');
const app = express();

class TestUtils {
  static getTestXml(xmlPath) {
    return fsReadFile(xmlPath).then((xmlStr) => (
      vastXml.parse(xmlStr)
    ));
  }

  static getExpressApp() {
    app.use(express.static('./'));
    return app;
  }
}

export default TestUtils;
