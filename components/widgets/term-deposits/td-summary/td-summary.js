define([
  "knockout",
  "jquery",
  "ojs/ojcore",
  "./model",

  "ojL10n!resources/nls/td-summary",
  "ojs/ojmodel",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojlistview",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource"
], function(ko, $, oj, AccountSummaryModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.tdSummaryLoaded = ko.observable(false);
    self.realData = [];
    self.ui = ko.observable();
    self.selectedValue = ko.observable();
    self.conventionalAccountsAvailable = ko.observable(false);
    self.islamicAccountsAvailable = ko.observable(false);
    self.filteredAccounts = ko.observableArray();
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerElement("action-widget");
    rootParams.baseModel.registerComponent("td-corporate-details", "term-deposits");
    self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.filteredAccounts,{idAttribute: "id"}));

    self.typeOfAccounts = [{
      id: "CON",
      label: self.nls.accountSummary.conventionalAccount
    }, {
      id: "ISL",
      label: self.nls.accountSummary.islamicAccount
    }];

    self.selectedAccountType = function() {
      if (self.selectedValue() === "ISL") {
        return self.nls.depositsSummary.profitRate;
      }
      if(self.selectedValue() === "CON") {
        return self.nls.depositsSummary.interestRate;
      }
    };

    self.hideClass = function(){
      if (self.selectedValue() === "ISL") {
        return "hide";
      }
        return "";
    };

    self.selectedAccountTypeChangedHandler = function(event) {
      self.filteredAccounts.removeAll();
      self.filteredAccounts(self.realData.filter(function(element) {
        return element.module.indexOf(event.detail.value) > -1;
      }));
      self.tdSummaryLoaded(true);
    };

    if (!(rootParams.data && rootParams.data.accountList)) {

      AccountSummaryModel.getAccountDetails().done(function(data) {
        if(data.accounts && data.accounts.length > 0){
          self.realData = data.accounts;
          for(var i=0;i< data.accounts.length ; i++){
            if (data.accounts[i].module === "CON") {
              self.conventionalAccountsAvailable(true);
            } else if (data.accounts[i] === "ISL") {
              self.islamicAccountsAvailable(true);
            }else if(self.conventionalAccountsAvailable() && self.islamicAccountsAvailable()){
              break;
            }
          }
        }

        if (!(self.conventionalAccountsAvailable() && self.islamicAccountsAvailable())) {
          self.filteredAccounts(self.realData);
          self.tdSummaryLoaded(true);
        }
      });

    } else {
      self.realData = rootParams.data.accountList;
      for(var i=0;i< rootParams.data.accountList.length ; i++){
        if (rootParams.data.accountList[i].module === "CON") {
          self.conventionalAccountsAvailable(true);
        } else if (rootParams.data.accountList[i] === "ISL") {
          self.islamicAccountsAvailable(true);
        }else if(self.conventionalAccountsAvailable() && self.islamicAccountsAvailable()){
          break;
        }
      }
      if (!(self.conventionalAccountsAvailable() && self.islamicAccountsAvailable())) {
        self.filteredAccounts(self.realData);
        self.tdSummaryLoaded(true);
      }
    }
    self.showAccountDetails = function(data) {
      rootParams.dashboard.loadComponent("td-corporate-details", data);
    };
    self.downloadAccounts = function() {
      AccountSummaryModel.downloadAccounts();
    };
  };
});
