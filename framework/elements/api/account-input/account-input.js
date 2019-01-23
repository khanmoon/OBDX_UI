define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/account-input",
  "ojs/ojknockout",
  "ojs/ojselectcombobox"
], function(oj, ko, $, AccountDetailsModel, locale) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.locale = locale;
    self.accountsParser = rootParams.accountsParser;
    self.accountList = ko.observableArray();
    self.displayAccountList = ko.observableArray();
    self.customerName = ko.observable();
    self.taskCode = rootParams.taskCode;
    self.class = rootParams.class;
    self.accountFetched = ko.observable();
    self.adtnlFetched = ko.observable(false);
    self.bankCode = ko.observable();
    self.type = rootParams.type;
    self.account = rootParams.account;
    self.id = rootParams.baseModel.incrementIdCount();
    self.modalId = rootParams.baseModel.incrementIdCount();
    self.readOnly = rootParams.readOnly ? rootParams.readOnly : false;
    self.label = self.readOnly ? locale.accountSelected : rootParams.label || locale.selectAccount;
    self.additionalDetails = rootParams.additionalDetails;
    self.validator = rootParams.validator;
    self.dataURL = rootParams.customURL ? rootParams.customURL : "demandDeposit";
    rootParams.baseModel.registerElement("modal-window");
    var moduleAvailable = false;
    var dataURLSubciption, taskCodeSubcription;
    if (ko.isObservable(self.dataURL)) {
      dataURLSubciption = self.dataURL.subscribe(function() {
        self.fetchList();
      });
    }

    self.getDisplayText = function(accountNumber, nickName) {
      if (nickName) {
        return rootParams.baseModel.format(self.locale.displayContent, {
          displayValue: accountNumber,
          nickname: nickName
        });
      }
      return accountNumber;

    };

    function setAdditionalDetails(account) {
      self.adtnlFetched(false);
      if (account) {
        var i;
        for (i = 0; i < self.accountList().length; i++) {
          if (self.accountList()[i].id.value === account) {
            self.account(account);
            self.customerName(self.accountList()[i].partyName);
            break;
          }
        }
        if (self.type === "address") {
          self.bankCode(self.accountList()[i].branchCode);
          AccountDetailsModel.fetchBankAddress(self.bankCode()).then(function(data) {
            self.additionalDetails({
              address: data.addressDTO[0],
              account: self.accountList()[i]
            });
            self.adtnlFetched(true);
          });
        } else if (self.type === "balance") {
          self.additionalDetails({
            account: self.accountList()[i]
          });
          self.adtnlFetched(true);
        } else if (self.type === "nodeValue") {
          self.additionalDetails(self.accountList()[i]);
          self.adtnlFetched(true);
        } else if (self.module && self.module === "loans") {
          self.additionalDetails({
            account: self.accountList()[i]
          });
          self.adtnlFetched(true);
        }
      }
    }
    self.fetchList = function() {
      AccountDetailsModel.fetchAccountData(ko.utils.unwrapObservable(self.dataURL), ko.utils.unwrapObservable(self.taskCode)).then(function(data) {
        self.accountList.removeAll();
        self.displayAccountList.removeAll();
        data.accounts = data.accounts || [];
        if (self.accountsParser) {
          data = self.accountsParser(data);
        }
        if (!data.accounts.length) {
          rootParams.baseModel.showMessages(null, [rootParams.no_data_message || self.locale.noAccounts], "ERROR");
          return;
        }

        if (self.account()) {
          var accountInFilteredResults = data.accounts.filter(function(element) {
            return element.id.value === self.account();
          })[0];
          if (!accountInFilteredResults) {
            $("#" + self.modalId).trigger("openModal");
          }
        }
        ko.utils.arrayPushAll(self.accountList, data.accounts);
        data.accounts = rootParams.baseModel.sortLib(data.accounts, [
          "partyName",
          "accountNickname"
        ]);
        data.accounts.forEach(function(item) {
          item.label = self.getDisplayText(item.id.displayValue, item.accountNickname);
          item.value = item.id.value;
          moduleAvailable = item.module;
        });
        var result = rootParams.baseModel.groupBy(data.accounts,moduleAvailable ? [
          "partyId.value",
          "module"
        ] : ["partyId.value"], function(item) {
          return [
              item.partyName,
              self.locale[item.module]
            ];
        });
        if (result.length === 1) {
          result = result[0].children;
        }
        ko.utils.arrayPushAll(self.displayAccountList, result);
        setAdditionalDetails(self.account());
        self.accountFetched(true);
      }).catch(function() {
        self.accountFetched(false);
        rootParams.baseModel.showMessages(null, [rootParams.no_data_message || self.locale.noActiveAccounts], "ERROR");
      });
    };

  self.closeModal = function(){
    rootParams.dashboard.hideDetails();
  };
  self.closeModalWindow = function(){
    $("#" + self.modalId).trigger("closeModal");
  };
    self.fetchList();
    if (self.taskCode && ko.isObservable(self.taskCode)) {
      taskCodeSubcription = self.taskCode.subscribe(function() {
        self.fetchList();
      });
    }
    var localAccountSubciption = self.account.subscribe(function(value) {
      setAdditionalDetails(value);
    });
    self.dispose = function() {
      localAccountSubciption.dispose();
      if (dataURLSubciption) {
        dataURLSubciption.dispose();
      }
      if (taskCodeSubcription) {
        taskCodeSubcription.dispose();
      }
    };
  };
});
