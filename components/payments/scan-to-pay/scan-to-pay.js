define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/scan-to-pay",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojknockout-validation"
], function(oj, ko, $, ResourceBundle, Model) {
  "use strict";
  return function(rootParams) {
    var self = this;
    var getNewKoModel = function() {
      var KoModel = ko.mapping.fromJS(Model.getNewModel());
      return KoModel;
    };
    self.scanToPay = getNewKoModel().payload;
    self.validationTracker = ko.observable();
    self.currencyList = ko.observable();
    self.currencyURL = ko.observable();
    self.dataLoaded = ko.observable(false);
    self.beneName = ko.observable();
    self.additionalDetails = ko.observable();
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.baseModel.registerElement("account-input");
    rootParams.baseModel.registerElement("amount-input");
    rootParams.baseModel.registerComponent("review-scan-to-pay", "payments");
    rootParams.baseModel.registerComponent("transfer-view-limits", "payments");
    rootParams.baseModel.registerComponent("my-limits", "limits-enquiry");
    rootParams.baseModel.registerComponent("payment-landing", "payments");
    rootParams.dashboard.headerName(self.resource.header);
    self.viewLimitsFlag = ko.observable(false);
    self.cancelAndGoBack = function() {
      $("#invalidQRPopUp").hide();
      self.dataLoaded(false);
      if (rootParams.dashboard.application() === "scan-to-pay") {
        rootParams.dashboard.switchModule();
      } else {
        history.back();
      }
    };
    self.viewLimits = function() {
      $("#viewlimits-bill-payment").trigger("openModal");
      self.viewLimitsFlag(true);
    };
    self.closeLimitsModal = function() {
      $("#viewlimits-bill-payment").trigger("closeModal");
    };
    self.beneName(self.params.beneName);
    self.scanToPay.beneCode(self.params.beneCode);
    self.currencyURL("payments/transfers/qrCode/currencies?code=" + self.params.beneCode);
    self.dataLoaded(true);
    self.cancel = function() {
      rootParams.dashboard.hideDetails();
    };
    self.confirm = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      var payload = ko.mapping.toJSON(self.scanToPay);
      Model.makePayment(payload).done(function() {
        rootParams.dashboard.loadComponent("review-scan-to-pay", {
          scanToPay: self.scanToPay,
          beneName: self.beneName
        }, self);
      });
    };
    Model.getTransferPurpose().done(function(data) {
      if (!data.linkageList.length) {
        self.scanToPay.purpose(null);
      }
    });
    self.currencyParser = function(data) {
      var output = {};
      output.currencies = [];
      if (data.currencyDTO) {
        output.currencies.push({
          code: data.currencyDTO.code,
          description: data.currencyDTO.code
        });
      }
      return output;
    };
  };
});
