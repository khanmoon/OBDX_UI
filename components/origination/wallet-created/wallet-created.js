define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "ojL10n!resources/nls/wallet-created",
  "ojs/ojknockout",
  "ojs/ojbutton",
  "ojs/ojinputtext"
], function(oj, ko, $, ResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.save = function() {
      window.location.assign("../pages/wallet.html");
    };
  };
});
