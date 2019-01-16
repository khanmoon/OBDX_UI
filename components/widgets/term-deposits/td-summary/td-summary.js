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

    self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.realData));

    function setData(data) {
      if (data.accounts) {
        self.realData = data.accounts.map(function(val) {
          val.accountId = val.id.value;
          return val;
        });
      }
      self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.realData));

      self.tdSummaryLoaded(true);
    }

    self.selectedAccountTypeChangedHandler = function(event) {
      self.tdSummaryLoaded(false);
      self.filteredAccounts.removeAll();
      self.datasource = null;
      ko.utils.arrayPushAll(self.filteredAccounts, self.realData.filter(function(element) {
        return element.module.indexOf(event.detail.value) > -1;
      }));
      self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.filteredAccounts()));
      ko.tasks.runEarly();
      self.tdSummaryLoaded(true);
    };

    if (!(rootParams.data && rootParams.data.accountList)) {

      AccountSummaryModel.getAccountDetails().done(function(data) {
        self.realData = data.accounts;
        data.accounts.forEach(function(element) {
          if (element.module === "CON") {
            self.conventionalAccountsAvailable(true);
          } else if (element.module === "ISL") {
            self.islamicAccountsAvailable(true);
          }
        });
        if (!(self.conventionalAccountsAvailable() && self.islamicAccountsAvailable())) {
          setData(data);
        }
      });

    } else {
      self.realData = rootParams.data.accountList;
      rootParams.data.accountList.forEach(function(element) {
        if (element.module === "CON") {
          self.conventionalAccountsAvailable(true);
        } else if (element.module === "ISL") {
          self.islamicAccountsAvailable(true);
        }
      });
      if (!(self.conventionalAccountsAvailable() && self.islamicAccountsAvailable())) {
        setData(rootParams.data);
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
