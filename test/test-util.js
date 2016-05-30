'use strict';

import vastXml from 'vast-xml-4';
import Bluebird from 'bluebird';
import fs from 'fs';

const fsReadFile = Bluebird.promisify(fs.readFile);

class TestUtils {
  static getTestXml(xmlPath) {
    return fsReadFile(xmlPath).then((xmlStr) => (
      vastXml.parse(xmlStr)
    ));
  }
}

export default TestUtils;
