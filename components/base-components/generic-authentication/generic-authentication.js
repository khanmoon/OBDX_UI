define([
  "knockout"
], function(ko) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.showComponent = ko.observable();
    self.show = ko.observable(false);
    var authTypes = {
      "OTP" : "otp-screen",
      "T_SOFT_TOKEN" : "time-based-otp-screen",
      "SEC_QUE" : "security-questions",
      "R_SOFT_TOKEN" : "hotp-screen"
    };
    rootParams.baseModel.registerComponent("otp-screen", "base-components");
    rootParams.baseModel.registerComponent("time-based-otp-screen", "base-components");
    rootParams.baseModel.registerComponent("security-questions", "base-components");
    rootParams.baseModel.registerComponent("hotp-screen", "base-components");
    function show2FAscreen(authViewModel){
      self.show(false);
      ko.tasks.runEarly();
      var challenge = JSON.parse(authViewModel.serverResponse.getResponseHeader("X-CHALLENGE"));
      self.showComponent(authTypes[challenge.authType]);
      self.show(true);
    }
    var subscribe = rootParams.rootModel.subscribe(function(newValue) {
      show2FAscreen(newValue);
    });
    show2FAscreen(rootParams.rootModel());
    self.dispose = function(){
      subscribe.dispose();
    };
  };
});
