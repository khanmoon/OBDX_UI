define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",
    "ojL10n!resources/nls/td-summary",
    "ojL10n!resources/nls/account-summary",
    "ojL10n!resources/nls/loan-summary",
    "ojL10n!resources/nls/financial-summary",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable",
    "ojs/ojlistview",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojnavigationlist"
], function (oj, ko, FinancialSummaryModel, $, tdResourceBundle, casaResourceBundle, loanResourceBundle, finResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.nls = finResourceBundle;
        self.accounts = {};
        var types = [];
        var totalCount = 0;
        self.showSummaryData = ko.observable(false);
        self.detailsLoaded = ko.observable(false);
        self.moduleData = ko.observable();
        self.currentSelection = ko.observable("CSA");
        rootParams.baseModel.registerComponent("accounts-action-card", "widgets/corporateDashboard");
        rootParams.baseModel.registerComponent("account-details", "demand-deposits");
        rootParams.baseModel.registerComponent("td-corporate-details", "term-deposits");
        rootParams.baseModel.registerComponent("loan-corporate-details", "loans");
        rootParams.baseModel.registerComponent("corporate-account-details", "widgets/corporateDashboard");
        function setData(data){
          $(data.accounts).each(function (index, item) {
              var ccyBalance;
              if (!self.accounts[item.type]) {
                  types.push(item.type);
                  self.accounts[item.type] = {};
                  self.accounts[item.type].totalCount = "";
                  self.accounts[item.type].ccywisePosition = [];
                  self.accounts[item.type].datasource = {};
                  self.accounts[item.type].accountList = [];
                  self.accounts[item.type].showComponent = item.type === "CSA" ? "account-summary" : item.type === "TRD" ? "td-summary" : "loan-summary";
                  if (item.type === "CSA") {
                      self.accounts[item.type].accountDetaislLoaded = ko.observable(true);
                      self.accounts[item.type].nls = casaResourceBundle;
                      self.accounts[item.type].moreTitle = self.nls.labels.ddDetailsTitle;
                      self.accounts[item.type].moreAlt = self.nls.labels.ddDetails;
                      self.accounts[item.type].loadImage = "dashboard/casa-icon.svg";
                  } else if (item.type === "TRD") {
                      self.accounts[item.type].tdSummaryLoaded = ko.observable(true);
                      self.accounts[item.type].nls = tdResourceBundle;
                      self.accounts[item.type].moreTitle = self.nls.labels.tdDetailsTitle;
                      self.accounts[item.type].moreAlt = self.nls.labels.tdDetails;
                      self.accounts[item.type].loadImage = "dashboard/td-icon.svg";
                  } else if (item.type === "LON") {
                      self.accounts[item.type].loanAccountDetaislLoaded = ko.observable(true);
                      self.accounts[item.type].nls = loanResourceBundle;
                      self.accounts[item.type].moreTitle = self.nls.labels.loanDetailsTitle;
                      self.accounts[item.type].moreAlt = self.nls.labels.loanDetails;
                      self.accounts[item.type].loadImage = "dashboard/loans-icon.svg";
                  }
                  self.accounts[item.type].hideDetailsTable = ko.observable(false);
              }
              if (item.type === "CSA") {
                  ccyBalance = item.availableBalance;
              } else if (item.type === "TRD") {
                  ccyBalance = item.maturityAmount;
              } else if (item.type === "LON") {
                  ccyBalance = item.outstandingAmount;
              }
              function checkCurrency(searchData, chkCurrency) {
                  var position = -1;
                  $(searchData).each(function (k, v) {
                      if (v.currency === chkCurrency) {
                          position = k;
                          return false;
                      }
                  });
                  return position;
              }
              var position = checkCurrency(self.accounts[item.type].ccywisePosition, ccyBalance.currency);
              if (position < 0) {
                  self.accounts[item.type].ccywisePosition.push({
                      currency: ccyBalance.currency,
                      noOfAccount: 1,
                      totalBal: ccyBalance.amount
                  });
              } else {
                  self.accounts[item.type].ccywisePosition[position].noOfAccount++;
                  self.accounts[item.type].ccywisePosition[position].totalBal += ccyBalance.amount;
              }
              self.accounts[item.type].accountList.push(item);
          });
          for (var index = 0; index < types.length; index++) {
              totalCount = 0;
              var count;
              if (types[index] === "CSA") {
                  for (count = 0; count < self.accounts[types[index]].ccywisePosition.length; count++) {
                      totalCount = totalCount + self.accounts[types[index]].ccywisePosition[count].noOfAccount;
                  }
                  self.accounts[types[index]].totalCount = totalCount;
              }
              if (types[index] === "TRD") {
                  for (count = 0; count < self.accounts[types[index]].ccywisePosition.length; count++) {
                      totalCount = totalCount + self.accounts[types[index]].ccywisePosition[count].noOfAccount;
                  }
                  self.accounts[types[index]].totalCount = totalCount;
              }
              if (types[index] === "LON") {
                  for (count = 0; count < self.accounts[types[index]].ccywisePosition.length; count++) {
                      totalCount = totalCount + self.accounts[types[index]].ccywisePosition[count].noOfAccount;
                  }
                  self.accounts[types[index]].totalCount = totalCount;
              }
              self.accounts[types[index]].accountList = $.map(self.accounts[types[index]].accountList, function (val) {
                  val.accountId = val.id.value;
                  return val;
              });
              self.accounts[types[index]].datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.accounts[types[index]].accountList, { idAttribute: "accountId" }));
              if (types[index] === "CSA") {
                  self.accounts[types[index]].datasource.sort({
                      key: "rawAvailableBalance",
                      direction: "descending"
                  });
              } else if (types[index] === "TRD") {
                  self.accounts[types[index]].datasource.sort({
                      key: "rawMaturityDate",
                      direction: "ascending"
                  });
              } else if (types[index] === "LON") {
                  self.accounts[types[index]].datasource.sort({
                      key: "rawMaturityDate",
                      direction: "ascending"
                  });
              }
          }
          self.showSummaryData(true);
        }
        FinancialSummaryModel.getAccountDetails().then(function (data) {
        setData(data);
      });
        var typeMap = {
            CSA: "demandDeposit",
            TRD: "deposit",
            LON: "loan"
        };
        self.downloadAccounts = function (data) {
            FinancialSummaryModel.downloadAccounts(typeMap[data]);
        };
        self.animateLoader = ko.observable();
        self.moduleData.subscribe(function (newValue) {
            self.animateLoader(null);
            if (newValue === "CSA") {
                setTimeout(function () {
                    self.animateLoader("colorCasa animate");
                }, 100);
            } else if (newValue === "TRD") {
                setTimeout(function () {
                    self.animateLoader("colorTd animate");
                }, 100);
            } else {
                setTimeout(function () {
                    self.animateLoader("colorLoan animate");
                }, 100);
            }
        });
        self.showSummaryDetails = function (section) {
            self.moduleData(section);
        };
        self.showSummaryDetails("CSA");
        self.showAccountDetails = function (data) {
            if (data.type === "CSA") {
                rootParams.rootModel.loadComponent("account-details", data);
            } else if (data.type === "TRD") {
                rootParams.rootModel.loadComponent("td-corporate-details", data);
            } else if (data.type === "LON") {
                rootParams.rootModel.loadComponent("loan-corporate-details", data);
            }
        };
    };
});
