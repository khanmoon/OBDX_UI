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
    };
    self.loginRedirect = function() {
      if (Constants.authenticator === "OBDXAuthenticator") {
        rootParams.baseModel.switchPage({
          module: "login"
        }, false);
      } else {
        rootParams.baseModel.switchPage({}, true);
      }
    };
    self.cancelClicked = function() {
      rootParams.baseModel.switchPage(null, false);
    };
  };
});
