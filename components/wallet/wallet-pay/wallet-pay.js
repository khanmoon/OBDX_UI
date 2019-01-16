define([
  "knockout",
  "jquery",
  "ojs/ojcore",
  "./model",
  "baseLogger",

  "base-models/validations/obdx-locale",
  "ojL10n!resources/nls/wallet-pay",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext",
  "ojs/ojknockout-validation",
  "ojs/ojbutton"
], function(ko, $, oj, WalletPayModel, BaseLogger, validator, ResourceBundle) {
  "use strict";

  var vm = function viewModel(rootParams) {
    var self = this;
    self.walletPayee = ko.observable("");
    ko.utils.extend(self, rootParams.rootModel);
    self.payee = ko.observableArray([]);
    self.showPayee = ko.observable(false);
    self.wallet = ResourceBundle.wallet;
    self.common = ResourceBundle.common;
    self.buttonEnable = ko.observable(true);
    self.payeeNotSelected = ko.observable(true);
    self.selectedPayee = null;
    self.payeeName = null;
    self.validationTracker = ko.observable();
    self.payComment = ko.observable();
    self.referencenumber = ko.observable();
    self.stageOne = ko.observable(true);
    self.stageTwo = ko.observable(false);
    self.stageThree = ko.observable(false);
    self.otpEntered = ko.observable(null);
    self.baseURL = "";
    self.prerequisiteInfo = ko.observable(self);
    rootParams.baseModel.registerElement("comment-box");
    rootParams.baseModel.registerElement("amount-input");
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerElement("row");
    rootParams.baseModel.registerComponent("otp-verification", "base-components");
    WalletPayModel.init(rootParams.dashboard.dataToBePassed().walletId.value);
    var getNewKoModel = function() {
      var KoModel = WalletPayModel.getNewModel();
      KoModel.amount.amount = ko.observable(ko.utils.unwrapObservable(KoModel.amount.amount));
      KoModel.comments = ko.observable(ko.utils.unwrapObservable(KoModel.comments));
      return KoModel;
    };
    self.transactionDetails = getNewKoModel();
    self.beneList = ko.observable();
    WalletPayModel.getPayeeList().done(function(data) {
      self.beneList(data.recentlyPaidContacts);
    });
    self.filteredPayee = ko.computed(function() {
      var filter = self.walletPayee();
      if (!filter) {
        return self.beneList();
      }
      return ko.utils.arrayFilter(self.beneList(), function(item) {
        if (item.firstName && item.firstName.toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
          return true;
        }
        if (item.lastName && item.lastName.toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
          return true;
        }
        if (item.mobileNo && item.mobileNo.toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
          return true;
        }
        if (item.emailId && item.emailId.toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
          return true;
        }
        return false;
      });
    });
    self.selectPayee = function(data) {
      self.selectedPayee = data;
      self.walletPayee(data.firstName + "" + data.lastName);
      self.payeeNotSelected(false);
      self.showPayee(false);
    };
    self.setIsSelected = function() {
      self.showPayee(false);
      self.payeeNotSelected(true);
      if (!(self.filteredPayee().length > 0)) {
        self.showPayee(false);
      }
    };

    function chkRegex(regex, str) {
      var patt = new RegExp(regex);
      return patt.test(str);
    }

    self.validateRecepient = {
      validate: function() {
        if (self.showPayee() || !self.payeeNotSelected()) {
          return true;
        }
        if (isNaN(self.walletPayee())) {
          if (!chkRegex(decodeURIComponent(validator.validationMessages.EMAIL[0].options.pattern), self.walletPayee())) {
            throw new oj.ValidatorError("", oj.Translations.getTranslatedString(validator.validationMessages.EMAIL[0].options.messageDetail));
          }
          self.transactionDetails.emailId = self.walletPayee();
          self.transactionDetails.transferMode = "EMAIL";
        } else {
          if (!chkRegex(decodeURIComponent(validator.validationMessages.MOBILE_NO[0].options.pattern), self.walletPayee())) {
            throw new oj.ValidatorError("", oj.Translations.getTranslatedString(validator.validationMessages.MOBILE_NO[0].options.messageDetail));
          }
          self.transactionDetails.mobileNo = self.walletPayee();
          self.transactionDetails.transferMode = "MOBILE";
        }
        return true;
      }
    };
    self.transferFund = function() {
      WalletPayModel.transferFunds(ko.toJSON(self.transactionDetails)).done(function(data) {
        rootParams.dashboard.headerName(self.wallet.pay.header);

        self.transactionDetails.comments(self.payComment());
        self.stageOne(false);
        self.stageTwo(true);
        self.referencenumber(data.referenceNo);
        self.baseURL = "wallets/" + rootParams.dashboard.dataToBePassed().walletId.value + "/transfer/" + self.referencenumber();
        self.buttonEnable(true);
      });
    };
    self.initiateTransaction = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {

        return;
      }
      self.transactionDetails.comments(self.payComment());
      if (self.payeeNotSelected()) {
        self.payeeName = self.walletPayee();
      } else {
        self.payeeName = self.selectedPayee.firstName + "" + self.selectedPayee.lastName;
        self.transactionDetails.emailId = self.selectedPayee.emailId;
        self.transactionDetails.mobileNo = self.selectedPayee.mobileNo;
        self.transactionDetails.payeeAccountNo = self.selectedPayee.walletId;
        self.transactionDetails.transferMode = "EMAIL";
        self.transactionDetails.amount.currency = self.walletCurrency();
      }
      self.transferFund();
    };
    self.isNotificationData = ko.observable(false);
    if (self.prerequisiteInfo().firstName && self.prerequisiteInfo().firstName !== null) {
      self.payeeNotSelected(true);
      self.walletPayee(self.prerequisiteInfo().firstName + "" + self.prerequisiteInfo().lastName);
      self.payeeName = self.walletPayee();
      self.transactionDetails.mobileNo = self.prerequisiteInfo().mobileNo;
      self.transactionDetails.transferMode = "MOBILE";
      self.transactionDetails.payeeAccountNo = self.prerequisiteInfo().walletId;
      self.transactionDetails.amount.amount(self.prerequisiteInfo().amount);
      self.transactionDetails.amount.currency = self.prerequisiteInfo().currency;
      self.transactionDetails.comments(self.prerequisiteInfo().comments);
      self.payComment(self.prerequisiteInfo().comments);
      self.isNotificationData(true);
      location.hash = "notificationreview";
      self.stageOne(false);
      self.stageTwo(true);
    }
    self.cancelTransfer = function() {
      if (self.prerequisiteInfo().requestFlow === true) {
        location.reload();
      }
      rootParams.dashboard.headerName(self.wallet.pay.header);
      self.showBalanceInfo(true);
      self.stageOne(true);
      self.stageTwo(false);
      self.deleteTransaction();
    };
    self.checkOTPConfiguration = function() {
      if (self.prerequisiteInfo().firstName && self.prerequisiteInfo().firstName !== null) {
        WalletPayModel.initiateNotificationPayment(self.prerequisiteInfo().requestId).done(function(data) {
          self.referencenumber(data.referenceNo);
          data.transferType = "WAL";
          if (data.tokenAvailable) {
            self.stageTwo(false);
            self.stageThree(true);
            self.baseURL = "wallets/" + rootParams.dashboard.dataToBePassed().walletId.value + "/notifications/" + self.prerequisiteInfo().requestId + "/acceptance";
          } else {
            self.verifyOTP(data);
          }
        });
      } else {
        WalletPayModel.checkOTPConfiguration(self.referencenumber()).done(function(data) {
          self.showBalanceInfo(false);
          if (data.tokenAvailable === true) {
            self.stageTwo(false);
            self.stageThree(true);
          } else {
            self.verifyOTP(data);
          }
        });
      }
    };
    self.verifyOTP = function(data) {
      if (data.paymentStatus === "VER" && (data.transferType === "CLM" || data.paymentStatus === "COM") && data.transferType === "WAL") {

        self.confirmationMsg1(rootParams.baseModel.format(self.wallet.pay.referenceNum, {
          refnumber: data.referenceNo
        }));
        self.openComponent = ko.observable("wallet-success");
        rootParams.baseModel.registerComponent("wallet-success", "wallet");
        rootParams.dashboard.loadComponent(self.openComponent(), {}, self);
      }
    };
    self.deleteTransaction = function() {
      WalletPayModel.deleteTransaction(self.referencenumber());
    };

    $(window).on("hashchange", function() {
      if (location.hash === "") {
        if (self.isNotificationData()) {
          window.location = "wallet.html";
        }
      } else if (location.hash === "#notificationreview") {
        rootParams.dashboard.backAllowed(false);
      }
    });
  };
  vm.prototype.dispose = function() {
    this.filteredPayee.dispose();
  };
  return vm;
});