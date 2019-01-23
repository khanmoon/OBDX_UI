define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/forgot-user",
  "ojs/ojbutton",
  "ojs/ojinputtext",
  "ojs/ojvalidationgroup",
  "ojs/ojknockout-validation",
  "ojs/ojdatetimepicker",
  "ojs/ojtimezonedata"
], function(oj, ko, $, UserIdRecoveryInfoModel, Constants, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.emailId = ko.observable();
    self.nls = resourceBundle;
    rootParams.dashboard.headerName(self.nls.forgotUserId.header.forgotUserName);
    self.validationTracker = ko.observable();
    self.verification = ko.observable(false);
    self.userInformation = ko.observable(true);
    self.dateOfBirth = ko.observable();
    self.todayDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));

    self.verify = function() {
      Promise.all([UserIdRecoveryInfoModel.sessionRequest()])
        .then(function() {
          UserIdRecoveryInfoModel.nonceRequest().done(function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
              return;
            }
            var payload = ko.toJSON({
              emailId: self.emailId(),
              dateOfBirth: self.dateOfBirth
            });
            UserIdRecoveryInfoModel.userIdRecoveryRequest(payload).done(function() {
              self.userInformation(false);
              self.verification(true);
            });
          });
        });
    };
    self.loginRedirect = function() {
      if (!rootParams.baseModel.cordovaDevice()) {
        if (Constants.authenticator === "OBDXAuthenticator") {
          rootParams.baseModel.switchPage({
            module: "login"
          }, false);
        } else {
          rootParams.baseModel.switchPage({}, true);
        }
      } else {
        rootParams.baseModel.switchPage({
          module: "login",
          internal: true
        }, false);
      }
    };
    self.cancelClicked = function() {
      if (!rootParams.baseModel.cordovaDevice()) {
        rootParams.baseModel.switchPage(null, false);
      } else {
        rootParams.baseModel.switchPage({
          module: "login",
          internal: true
        }, false);
      }
    };
  };
});
