define([
  "knockout",
  "jquery",
  "ojL10n!resources/nls/loan-showcase"
], function(ko, $, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.viewProducts = function() {
      window.location = "goal-calculator.html";
    };
  };
});