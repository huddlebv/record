"use strict";
exports.__esModule = true;
var axios_1 = require("./axios");
(0, axios_1.setup)({
    baseUrl: 'https://huddle.test/api/v3/'
});
console.log(axios_1.axiosInstance);
console.log('test');
