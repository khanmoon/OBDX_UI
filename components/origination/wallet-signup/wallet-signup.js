define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "ojL10n!resources/nls/wallet-signup",
  "ojs/ojknockout",
  "ojs/ojbutton"
], function(oj, ko, $, ResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.label(self.resource.wallet.header);
    self.resource = ResourceBundle;
    self.customComponentName = ko.observable();
    self.loadCustomComponent = ko.observable(false);
    rootParams.baseModel.registerComponent("user-information", "recovery");
    self.save = function() {
      self.getNextStage();
    };
    self.signIn = function() {
      window.location = "../pages/wallet.html";
    };
    self.forgotPassword = function() {
      self.customComponentName("user-information");
      self.loadCustomComponent(true);
    };
  };
});
