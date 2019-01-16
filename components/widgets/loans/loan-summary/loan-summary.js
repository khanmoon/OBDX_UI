define([
  "knockout",
  "jquery",
  "ojs/ojcore",
  "./model",
  "ojL10n!resources/nls/loan-summary",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojlistview",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource"
], function(ko, $, oj, LoanSummaryModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.nls = resourceBundle;
    self.loanAccountDetaislLoaded = ko.observable(false);
    var accountsData = [];
    self.filteredAccounts = ko.observableArray();
    self.conventionalAccountsAvailable = ko.observable(false);
    self.islamicAccountsAvailable = ko.observable(false);
    self.selectedValue = ko.observable();
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerElement("action-widget");
    rootParams.baseModel.registerComponent("loan-corporate-details", "loans");

    self.typeOfAccounts = [{
      id: "CON",
      label: self.nls.accountSummary.conventionalAccount
    }, {
      id: "ISL",
      label: self.nls.accountSummary.islamicAccount
    }];

    self.selectedAccountType = function() {
           if (self.selectedValue() === "ISL") {
               return self.nls.accountSummary.profitRate;
           }
           if(self.selectedValue() === "CON") {
               return self.nls.accountSummary.interestRate;
           }
       };

    self.selectedAccountTypeChangedHandler = function(event) {
      self.datasource = null;
      ko.utils.arrayPushAll(self.filteredAccounts, accountsData.filter(function(element) {
        return element.module.indexOf(event.detail.value) > -1;
      }));

      self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.filteredAccounts, {
        idAttribute: "accountNo"
      }));

      self.datasource.sort({
        key: "rawMaturityDate",
        direction: "ascending"
      });
      self.loanAccountDetaislLoaded(true);
    };

    function setData(accounts) {

      accounts.forEach(function(element) {
        if (element.module === "CON") {
          self.conventionalAccountsAvailable(true);
        } else if (element.module === "ISL") {
          self.islamicAccountsAvailable(true);
        }
      });

      accounts = $.map(ko.utils.unwrapObservable(accountsData), function(val) {
        val.accountNo = val.id.value;
        return val;
      });

      if (!(self.conventionalAccountsAvailable() && self.islamicAccountsAvailable())) {
        self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(accounts, {
          idAttribute: "accountNo"
        }));

        self.datasource.sort({
          key: "rawMaturityDate",
          direction: "ascending"
        });
        self.loanAccountDetaislLoaded(true);
      }
    }

    if (!(rootParams.data && rootParams.data.accountList)) {

      LoanSummaryModel.getAccountDetails().done(function(data) {
        if (data.accounts && data.accounts.length > 0) {
          accountsData = data.accounts;
        }
        setData(data.accounts);
      });
    } else {
      accountsData = rootParams.data.accountList;

      setData(rootParams.data.accountList);
    }

    self.showAccountDetails = function(data) {
      rootParams.dashboard.loadComponent("loan-corporate-details", data);
    };
    self.downloadAccounts = function() {
      LoanSummaryModel.downloadAccounts();
    };
  };
});
