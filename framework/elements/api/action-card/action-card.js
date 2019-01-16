define([
  "knockout",
  "jquery",
  "framework/js/constants/constants"
], function (ko, $, constants) {
  "use strict";
  return function (rootParams) {
    var self = this;
    self.cardData = rootParams.data;
    self.actionCardClick = rootParams.clickHandler;
    self.module = constants.module;
  };
});
