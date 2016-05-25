'use strict';

const express = require('express');
const app = express();

app.use(express.static('__tests_/test-data'));
app.use(express.static('./'));

app.listen(8080);
