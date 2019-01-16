define([], function () {
  "use strict";
  /**
   * Below Global Variable contains all the application level constants.
   * @namespace ApplicationConstants
   * @global
   */
  var CONSTANTS = {
    host: "fcubs",
    appBaseURL: "/digx",
    appDefaultVersion : "v1",
    RTL_LOCALES: ["ar", "he", "ku", "fa", "ur", "dv", "ha", "ps", "yi"],
    imageResourcePath: "/images",
    throttleSeconds: 5,
    brandPath: "",
    userSegment: "",
    module: "",
    region: "",
    brandID: null,
    currentServerDate: new Date(0),
    timezoneOffset : 0,
    currentEntity: "",
    defaultEntity : "OBDX_BU",
    jsonContext : "",
    buildFingerPrint : null,
    helpDeskSessionKey : "",
    enableAxe : false,
    pages: {
      securePage: "/pages/home.html",
      publicPage: "/index.html"
    },
    authenticator: "OUD",
    webAnalytics : ""
  };
  return Object.seal(CONSTANTS);
});
