define([
  "knockout",
  "jquery",
  "./model",

  "framework/js/constants/constants",
  "ojL10n!resources/nls/td-redeem",
  "ojs/ojbutton",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup"
], function(ko, $, RedeemModel, Constants, locale) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.constants = Constants;
    self.additionalDetails = ko.observable();
    self.validationTracker = ko.observable();
    self.chargesLoaded = ko.observable();
    self.moduleType = ko.observable();
    self.isPartialRedeemAllowed = ko.observable(true);
    ko.utils.extend(self, rootParams.rootModel);
    self.locale = locale;
    var confirmScreenExtensions = {};
    rootParams.dashboard.headerName(self.locale.redeem.header);
    rootParams.baseModel.registerComponent("account-nickname", "accounts");
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerElement("account-input");
    rootParams.baseModel.registerElement("amount-input");
    rootParams.baseModel.registerComponent("td-payout", "term-deposits");
    rootParams.baseModel.registerComponent("review-td-redeem", "term-deposits");
    var getNewKoModel = function() {
      var KoModel = RedeemModel.getNewModel();
      return ko.mapping.fromJS(KoModel);
    };
    self.rootModelInstance = self.rootModelInstance || getNewKoModel();
    if (self.params.id) {
      self.rootModelInstance.accountId.value(self.params.id.value);
      self.rootModelInstance.redemptionAmount.currency(self.params.currencyCode);
    }
    function fetchPenalities() {
      self.chargesLoaded(false);
      RedeemModel.redeemDetails(self.rootModelInstance.accountId.value(), ko.mapping.toJSON(self.rootModelInstance)).done(function(data) {
        delete data.redemptionDetailDTO.payoutInstructions;
        delete data.redemptionDetailDTO.redemptionAmount;
        ko.mapping.fromJS(data.redemptionDetailDTO, {}, self.rootModelInstance);
        self.chargesLoaded(true);
      });
    }
    if (Constants.userSegment === "RETAIL") {
      fetchPenalities();
    }
    var subscription1 = self.rootModelInstance.accountId.value.subscribe(function() {
      fetchPenalities();
    });
    var subscription2 = self.additionalDetails.subscribe(function(value) {
      self.rootModelInstance.accountId.displayValue(value.account.id.displayValue);
      self.rootModelInstance.redemptionAmount.currency(value.account.currencyCode);
      self.isPartialRedeemAllowed(value.account.productDTO.facilityParameter.isPartialRedeemAllowed);
      self.moduleType(value.account.module);
      self.rootModelInstance.module(self.moduleType());
    });
    var subscription3 = self.rootModelInstance.typeRedemption.subscribe(function(value) {
      if (value === "P") {
        self.chargesLoaded(false);
        self.rootModelInstance.redemptionAmount.amount("");
      } else if (value === "F") {
        self.rootModelInstance.redemptionAmount.amount("");
        fetchPenalities();
      }
    });
    var subscription4 = self.rootModelInstance.redemptionAmount.amount.subscribe(function(newValue) {
      if (newValue && self.rootModelInstance.typeRedemption() === "P") {
        fetchPenalities();
      }
    });
    self.redeemVerify = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("redeemtd"))) {
        return;
      }
      RedeemModel.redeemDetails(self.rootModelInstance.accountId.value(), ko.mapping.toJSON(self.rootModelInstance)).done(function(data) {
        delete data.redemptionDetailDTO.payoutInstructions;
        delete data.redemptionDetailDTO.redemptionAmount;
        ko.mapping.fromJS(data.redemptionDetailDTO, {}, self.rootModelInstance);
        rootParams.dashboard.loadComponent("review-td-redeem", {
          mode: "review",
          data: self.rootModelInstance,
          confirmScreenExtensions: confirmScreenExtensions
        }, self);
      });
    };
    self.redeemTransactionConfirm = function() {
      if(self.rootModelInstance.typeRedemption() === "F") {
        self.rootModelInstance.redemptionAmount.amount(self.additionalDetails().account.currentPrincipalAmount.amount);
        self.rootModelInstance.redemptionAmount.currency(self.additionalDetails().account.currentPrincipalAmount.currency);
      }
      RedeemModel.redeem(ko.mapping.toJSON(self.rootModelInstance), self.rootModelInstance.accountId.value()).done(function(data, status, jqXhr) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.locale.redeem.header,
          eReceiptRequired: true,
          hostReferenceNumber: data.redemptionDetail ? data.redemptionDetail[0].redeemReferenceNo : null,
          template: "confirm-screen/td-template",
          isRedeem: true,
          confirmScreenExtensions: confirmScreenExtensions
        }, self);
      });
    };
    self.dispose = function() {
      subscription1.dispose();
      subscription2.dispose();
      subscription3.dispose();
      subscription4.dispose();
    };
  };
});
