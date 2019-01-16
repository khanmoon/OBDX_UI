define([
  "knockout",
  "jquery",

  "ojL10n!resources/nls/pin-login",
  "baseLogger",
  "json!local!./pin-pattern-max-attempts",
  "platform"
], function(ko, $, resourceBundle, BaseLogger, MaxAttempts, Platform) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.pin = ko.observable();
    self.maxlength = rootParams.data.lengthOfPin;
    self.error = ko.observable("");
    var errorAppPreference = function() {
      BaseLogger.error("error in getting or setting app preference");
    };
    self.closeDialog = function() {
      $("#pinLogin").hide();
    };
    $("#enterPin").ready(function() {
      $("#enterPin").attr("type", "tel");
    });
    var subtractNoOfAttempts = function() {
      window.plugins.appPreferences.fetch(function(value) {
        if (parseInt(value) > 0) {
          window.plugins.appPreferences.store(function() {
            self.getStoredToken();
          }, errorAppPreference, "max_attempts", parseInt(value) - 1);
        } else {
          self.closeDialog();
          self.deleteSecret(self.resource.maximumRetrysExceeded);
        }
      }, errorAppPreference, "max_attempts");
    };
    self.pinLoginProceed = function(event) {
      self.error(" ");
      if (event.detail.value.length === parseInt(rootParams.data.lengthOfPin)) {
        self.pin(event.detail.value);
        $("#enterPin").prop({
          disabled: true
        });
        subtractNoOfAttempts();
      }
    };
    self.getStoredToken = function() {
      function successCallback(result) {
        self.error(self.resource.loading);
        self.storedJWT(result);
        window.plugins.appPreferences.store(function() {
          Platform.getInstance().then(function(platform) {
            var serverType = self[platform("getServerType")];
            serverType.validateJWTToken("pin", {
              pin: self.pin()
            });
          });
        }, errorAppPreference, "max_attempts", MaxAttempts.maxAttempts);
      }

      function errorCallback() {
        window.plugins.appPreferences.fetch(function(maxAttempts) {
          if (parseInt(maxAttempts) < 1) {
            self.closeDialog();
            self.deleteSecret(self.resource.maximumRetrysExceeded);
          }
          $("#enterPin").removeClass("white-input").addClass("red-input");
          setTimeout(function() {
            self.pin("");
            $("#enterPin").removeClass("red-input").addClass("white-input").prop({
              disabled: false
            });
          }, 500);
        }, errorAppPreference, "max_attempts");
      }
      window.plugins.auth.pin.verify({
        pin: self.pin()
      }, successCallback, errorCallback);
    };
  };
});
