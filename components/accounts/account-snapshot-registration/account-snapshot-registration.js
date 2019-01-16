define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "ojL10n!resources/nls/account-snapshot-registration",
  "baseLogger"
], function(oj, ko, $, ResourceBundle, BaseLogger) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.allowSnapshot = ko.observable();
    rootParams.dashboard.headerName(self.resource.header);
    var dummyFunction = function() {
      BaseLogger.info("this is a dummy function");
    };

    self.proceed = function() {
      self.allowSnapshot(true);
      $("#requestPermision").trigger("closeModal");
      var registerationSuccessfulCallback = function() {
        rootParams.baseModel.registerComponent("product-home", "home");
        rootParams.dashboard.loadComponent("product-home", {
          landingModule: "accounts",
          landingComponent: "account-snapshot"
        }, self);
      };
      window.plugins.appPreferences.store(registerationSuccessfulCallback, dummyFunction, "account_snapshot_status", "PENDING");
    };

    self.dontProceed = function() {
      self.allowSnapshot(false);
      $("#requestPermision").trigger("closeModal");
      var registerationSuccessfulCallback = function() {
        rootParams.baseModel.registerComponent("product-home", "home");
        rootParams.dashboard.loadComponent("product-home", {
          landingModule: "accounts",
          landingComponent: "account-snapshot"
        }, self);
      };
      window.plugins.appPreferences.store(registerationSuccessfulCallback, dummyFunction, "account_snapshot_status", "PENDING");
    };

    self.enableQuickSnapshot = function() {
      window.Wearable.onConnect(function() {
        $("#requestPermision").trigger("openModal");
      }, function() {
        var registerationSuccessfulCallback = function() {
          rootParams.baseModel.registerComponent("product-home", "home");
          rootParams.dashboard.loadComponent("product-home", {
            landingModule: "accounts",
            landingComponent: "account-snapshot"
          }, self);
        };
        window.plugins.appPreferences.store(registerationSuccessfulCallback, dummyFunction, "account_snapshot_status", "PENDING");
      });

    };
  };
});
