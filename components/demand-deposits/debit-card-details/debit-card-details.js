define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/debit-card-details",
  "ojs/ojknockout",
  "ojs/ojinputnumber",
  "ojs/ojswitch",
  "ojs/ojbutton"
], function(oj, ko, $, ManageDebitCardModel, locale) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.locale = locale;
    Params.baseModel.registerElement("modal-window");
    Params.dashboard.headerName(self.locale.header.debitCardDetails);
    self.cardObject = self.params;
    self.expiryDate = ko.observable("-");
    self.accountId = self.cardObject.accountId.value;
    self.cardNo = self.cardObject.cardNo.value;
    self.internationalTransactionsValue = ko.observable(self.cardObject.isInternationalUsage);
    self.payload = ManageDebitCardModel.getNewDebitCardDetailsModel();
    self.internationalTransactionsStatus = ko.observable();
    self.modalCancel = ko.observable(false);
    self.popupHeader = ko.observable();
    self.popupMsg = ko.observable();
    self.popupBtn = ko.observable();
    self.popupIcon = ko.observable();
    self.debitCardDetailsObject = ko.observable();
    self.isDataLoaded = ko.observable(false);
    self.showFloatingPanel = function() {
      $("#panelDebitCard").trigger("openFloatingPanel");
    };
    ManageDebitCardModel.fetchDebitCardDetails(self.accountId, self.cardNo).done(function(data) {
      if (data.debitCardDetails.length > 0) {
        self.debitCardDetailsObject(data.debitCardDetails[0]);
        self.internationalTransactionsValue(data.debitCardDetails[0].isInternationalUsage);
        self.isDataLoaded(true);
      }
    });
    self.closeSwitchDialog = function() {
      self.modalCancel(true);
      if (self.internationalTransactionsValue()) {
        self.internationalTransactionsValue(false);
      } else {
        self.internationalTransactionsValue(true);
      }
      $("#internationalTransactions").trigger("closeModal");
    };

    self.showSwitchValue = function() {
      if (!self.internationalTransactionsValue()) {
        self.popupHeader(self.locale.debitCards.internationalFlagMsgHeaderD);
        self.popupMsg(self.locale.debitCards.internationalFlagMsgD);
        self.popupBtn(self.locale.debitCards.deactivate);
        self.popupIcon("icon-reject");
      } else {
        self.popupHeader(self.locale.debitCards.internationalFlagMsgHeaderA);
        self.popupMsg(self.locale.debitCards.internationalFlagMsgA);
        self.popupBtn(self.locale.debitCards.activate);
        self.popupIcon("icon-confirm");
      }
      $("#internationalTransactions").trigger("openModal");
    };

    self.internationalTransactionsChanged = function() {
      if (!self.internationalTransactionsValue()) {
        self.popupHeader(self.locale.debitCards.internationalFlagMsgHeaderD);
        self.popupMsg(self.locale.debitCards.internationalFlagMsgD);
        self.popupBtn(self.locale.debitCards.deactivate);
        self.popupIcon("icon-reject");
      } else {
        self.popupHeader(self.locale.debitCards.internationalFlagMsgHeaderA);
        self.popupMsg(self.locale.debitCards.internationalFlagMsgA);
        self.popupBtn(self.locale.debitCards.activate);
        self.popupIcon("icon-confirm");
      }
      $("#internationalTransactions").trigger("openModal");
    };

    self.disableInternationalTransaction = function() {
      self.payload.accountId = self.accountId;
      self.payload.cardNo = self.cardNo;
      self.payload.isInternationalUsage = self.internationalTransactionsValue();
      ManageDebitCardModel.updateInternationalUsage(self.accountId, self.cardNo, ko.toJSON(self.payload)).done(function() {
        $("#internationalTransactions").trigger("closeModal");
      }).fail(function() {
        $("#internationalTransactions").trigger("closeModal");
      });
    };
    self.expiryDate(self.cardObject.expiryDate);
    Params.baseModel.registerComponent("debit-card-pin-request", "demand-deposits");
    Params.baseModel.registerComponent("debit-card-hotlisting", "demand-deposits");
    Params.baseModel.registerComponent("debit-card-limits", "demand-deposits");
    Params.baseModel.registerComponent("reset-pin", "creditcard");
  };
});
