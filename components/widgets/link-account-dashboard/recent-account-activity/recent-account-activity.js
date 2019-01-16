define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/recent-account-activity",
  "ojs/ojbutton",
  "ojs/ojfilmstrip",
  "ojs/ojmenu",
  "ojs/ojselectcombobox"
], function(oj, ko, $, AccountActivity, ResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.detailsFetched = ko.observable(false);
    self.resource = ResourceBundle;
    self.selectedAccountType = ko.observable();
    self.items = ko.observableArray();
    self.externalAccounts = ko.observableArray();
    self.accountsMatched = {};
    self.accountsLoaded = ko.observable(false);
    self.accountsMatchedLoaded = ko.observable(false);
    self.accountList = ko.observableArray();
    self.accountTypeList = ko.observableArray([
      "CSA",
      "TRD",
      "LON"
    ]);
    var typeMap = {
        CSA: "demandDeposit",
        TRD: "deposit",
        LON: "loan"
    };
    var transactionCount = 3;
    rootParams.baseModel.registerElement("account-input");
    rootParams.baseModel.registerElement("date-box");

    function setPageData(data) {
      var tempData = $.map(data, function(v) {
        var newObj = {};
        newObj.date = v.transactionDate ? rootParams.baseModel.formatDate(v.transactionDate) : "";
        newObj.narration = v.narration || v.description;
        newObj.tempCurrency = v.transactionAmount ? v.transactionAmount.currency : v.amountInAccountCurrency ? v.amountInAccountCurrency.currency : "";
        newObj.amount = v.transactionAmount ? v.transactionAmount.amount : v.amountInAccountCurrency ? v.amountInAccountCurrency.amount : "";
        newObj.amountClass = v.transactionType === "C" ? "" : "debit";
        newObj.id = v.accountId;
        newObj.transactionType = v.transactionType;
        return newObj;
      });
      return tempData;
    }

    function fetchData(account, bankId,type,accType) {
      self.items.removeAll();
      if(bankId){
        AccountActivity.fetchExternalTransactionDetails(ko.utils.unwrapObservable(account), accType, bankId).then(function(data) {
          ko.utils.arrayPushAll(self.items, setPageData(data.items));
        });
      }else{
        AccountActivity.fetchLocalTransactionDetails(ko.utils.unwrapObservable(account), type,transactionCount).then(function(data) {
          ko.utils.arrayPushAll(self.items, setPageData(data.items));
        });
      }

      self.detailsFetched(true);
    }

    var fetchExternalBankAccounts = function(accData) {

      self.accountsMatched = {};
      self.accountsMatchedLoaded(false);
      if (self.accountsLoaded()) {
        ko.utils.arrayForEach(self.externalAccounts(), function(item) {
          if (item.type === accData) {
            item.bankName = item.bankName || self.resource.myBankName;
            if (!self.accountsMatched[item.bankName]) self.accountsMatched[item.bankName] = [];
            self.accountsMatched[item.bankName].push(item);
          }
        });
        ko.tasks.runEarly();
        self.accountsMatchedLoaded(true);
      }
    };

    self.selectedAccountTypeChangedHandler = function(event) {
      self.selectedAccountType(self.resource[event.detail.value]);
      fetchExternalBankAccounts(event.detail.value);
    };
    self.selectedExternalAccountTypeChangedHandler = function(event) {
      var selectedID = event.detail.value;
      var code = "";
      var type = "";
      var accType = "";
      ko.utils.arrayForEach(self.externalAccounts(), function(item) {
        if (item.id.value === event.detail.value) {
          code = item.bankId;
          selectedID = item.id.value;
          type = typeMap[item.type];
          accType = item.type;
        }
      });
      fetchData(selectedID, code,type,accType,transactionCount);
    };

      Promise.all([AccountActivity.fetchAccesstoken(),AccountActivity.fetchAccounts()]).then(function(response){
        var tokens = response[0].accessTokenDTOs;
        if(tokens){
          for (var i = 0; i < tokens.length; i++) {
            AccountActivity.fetchexternalbankAccounts(tokens[i].bankCode).then(function(data) {
              ko.utils.arrayPushAll(self.externalAccounts, data.externalBankAccountDTOs);
              self.accountsLoaded(true);
            });
          }
        }
        var localAccounts = response[1].accounts;
          ko.utils.arrayPushAll(self.externalAccounts, localAccounts);
      });
  };
});
