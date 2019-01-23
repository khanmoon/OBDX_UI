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
    self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.filteredAccounts, {
      idAttribute: "id"
    }));

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
      self.filteredAccounts.removeAll();
      self.filteredAccounts(accountsData.filter(function(element) {
        return element.module.indexOf(event.detail.value) > -1;
      }));
      self.loanAccountDetaislLoaded(true);
    };


    if (!(rootParams.data && rootParams.data.accountList)) {

      LoanSummaryModel.getAccountDetails().done(function(data) {
        if (data.accounts && data.accounts.length > 0) {
          for(var i=0;i<data.accounts.length;i++){
            if (data.accounts[i].module === "CON") {
              self.conventionalAccountsAvailable(true);
            } else if (data.accounts[i].module === "ISL") {
              self.islamicAccountsAvailable(true);
            }else if(self.conventionalAccountsAvailable() && self.islamicAccountsAvailable()){
              break;
            }
          }
          accountsData = data.accounts;
        }
      });
    } else {
      accountsData = rootParams.data.accountList;
      for(var i=0;i<accountsData.length;i++){
        if (accountsData[i].module === "CON") {
          self.conventionalAccountsAvailable(true);
        } else if (accountsData[i].module === "ISL") {
          self.islamicAccountsAvailable(true);
        }else if(self.conventionalAccountsAvailable() && self.islamicAccountsAvailable()){
          break;
        }
      }
    }

    self.showAccountDetails = function(data) {
      rootParams.dashboard.loadComponent("loan-corporate-details", data);
    };
    self.downloadAccounts = function() {
      LoanSummaryModel.downloadAccounts();
    };
  };
});
