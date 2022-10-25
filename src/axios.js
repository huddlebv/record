"use strict";
exports.__esModule = true;
exports.setup = exports.axiosInstance = void 0;
var axios_1 = require("axios");
exports.axiosInstance = null;
function setup(options) {
    var _a;
    exports.axiosInstance = axios_1["default"].create({
        baseURL: (_a = options === null || options === void 0 ? void 0 : options.baseUrl) !== null && _a !== void 0 ? _a : ""
    });
}
exports.setup = setup;
;
