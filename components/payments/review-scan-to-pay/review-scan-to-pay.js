define([
  "ojs/ojcore",
  "knockout",

  "ojL10n!resources/nls/review-scan-to-pay",
  "./model",
  "ojs/ojinputtext"
], function(oj, ko, ResourceBundle, Model) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.scanToPay = self.params.scanToPay;
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.header);
    rootParams.baseModel.registerElement([
      "account-input",
      "confirm-screen"
    ]);
    self.cancel = function() {
      rootParams.dashboard.hideDetails();
    };
    self.confirm = function() {
      var payload = ko.mapping.toJSON(self.scanToPay);
      Model.makePayment(payload).done(function(data, status, jqXHR) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXHR,
          hostReferenceNumber: data.externalReferenceId,
          transactionName: self.resource.header,
          template: "confirm-screen/payments-template",
          confirmScreenExtensions: {
            isSet: true,
            taskCode: "PC_F_QRC"
          }
        }, self);
      });
    };
  };
});
