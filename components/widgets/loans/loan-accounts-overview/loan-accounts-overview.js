define([
  "knockout",
  "jquery",

  "ojL10n!resources/nls/loan-accounts-overview",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojchart",
  "ojs/ojlegend"
], function(ko, $, resourceBundle, Model) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerElement("action-widget");
    self.nls = resourceBundle;
    self.loanSeriesValue = ko.observableArray();
    self.totalOutstanding = ko.observable(0);
    self.totalBorrowings = ko.observable(0);
    self.loanOverviewGroupValue = ko.observable();
    self.currency = ko.observable();
    self.accountData = ko.observable();
    self.legendloaded = ko.observable(false);
    self.accountsLoaded = ko.observable(false);
    self.conventionalAccountsAvailable = ko.observable(false);
    self.islamicAccountsAvailable = ko.observable(false);
    self.barGapRatio = ko.observable(0.6);
    self.maxBarWidth = ko.observable(10);
    self.legendObject = rootParams.baseModel.large() ? {
      position: "end",
      maxSize: "50%"
    } : {
      position: "bottom"
    };

    self.typeOfAccounts = [{
      id: "CON",
      label: self.nls.accountDetails.labels.conventionalAccount
    }, {
      id: "ISL",
      label: self.nls.accountDetails.labels.islamicAccount
    }];

    self.selectedAccountTypeChangedHandler = function(event) {
      self.legendloaded(false);
      if(event.detail.value === "CON"){
        self.currency(self.accountData().items[0].totalOutstandingBalance.currency);
        self.totalOutstanding(self.accountData().items[0].totalActiveOutstandingBalance.amount);
        self.totalBorrowings(self.accountData().items[0].totalActiveBorrowings.amount);
      }else{
        self.currency(self.accountData().items[0].totalISLActiveOutstandingBalance.currency);
        self.totalOutstanding(self.accountData().items[0].totalISLActiveOutstandingBalance.amount);
        self.totalBorrowings(self.accountData().items[0].totalActiveBorrowings.amount);
      }

        self.loanOverviewGroupValue([
          rootParams.baseModel.format(self.nls.accountDetails.labels.totalBorrowing, {
            amount: rootParams.baseModel.formatCurrency(self.totalBorrowings(), self.currency())
          }),
          rootParams.baseModel.format(self.nls.accountDetails.labels.currentOutstanding, {
            amount: rootParams.baseModel.formatCurrency(self.totalOutstanding(), self.currency())
          })
        ]);
        self.loanSeriesValue([{
          items: [{
              value: self.totalOutstanding(),
              className: "totalInvestment"
            },
            {
              value: self.totalBorrowings(),
              className: "totalMaturityAmount"
            }
          ]
        }]);
        self.legendSections = ko.observableArray([{
          items: [{
              text: rootParams.baseModel.format(self.nls.accountDetails.labels.totalBorrowing, {
                amount: rootParams.baseModel.formatCurrency(self.totalBorrowings(), self.currency())
              }),
              className: "totalInvestment"
            },
            {
              text: rootParams.baseModel.format(self.nls.accountDetails.labels.currentOutstanding, {
                amount: rootParams.baseModel.formatCurrency(self.totalOutstanding(), self.currency())
              }),
              className: "totalMaturityAmount"
            }
          ]
        }]);
        self.legendloaded(true);
        self.defaultStyle = ko.pureComputed(function() {
          return {
            barGapRatio: self.barGapRatio(),
            maxBarWidth: self.maxBarWidth()
          };
        });
    };

    Model.fetchAccounts().then(function(data) {
      if (data && data.summary) {
        self.accountData(data.summary);
        self.accountsLoaded(true);
      }
    });
  };
});
