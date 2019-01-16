define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/consolidated-listing"
], function (ko, $, ListingModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this, i;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        self.dataFetched = ko.observable(false);
        self.dataFetchedFromServer = ko.observableArray();
        rootParams.dashboard.dashboard = ko.observable(true);
        self.doneCredit = ko.observable(false);
        self.totalCreditCardAmount = ko.observable();
        self.islamicLoanAccountsPresent = ko.observable(false);
        self.listLength = ko.observable(3);
        self.loansCards = ko.observableArray();
        self.currentNavArrowPlacement = ko.observable("adjacent");
        self.currentNavArrowVisibility = ko.observable("auto");
        self.modulesLoaded = ko.observable(false);
        self.modifiedResponse = ko.observableArray([]);
        self.getItemInitialDisplay = function (index) {
            return index < 3 ? "" : "none";
        };
        rootParams.baseModel.registerElement("dashboard-card");
        rootParams.baseModel.registerComponent("personal-finance-management", "accounts");
        rootParams.baseModel.registerComponent("consolidated-accounts-list", "accounts");
        self.nameParser = function (data) {
            if (data === "CCA") {
                return "cards";
            }
            if (data === "CSA") {
                return "demand-deposits";
            }
            if (data === "LON") {
                return "loans";
            }
            if (data === "TRD") {
                return "term-deposits";
            }
        };

        ListingModel.fetchCardInfo().then(function (data) {
            var count = 0;
            ko.utils.arrayForEach(data.creditcards, function (item) {
                if (item.cardStatus === "ACT") {
                    count += 1;
                }
            });
            if (data.sumOfEquivalentDue.amount || count > 0) {
                self.totalCreditCardAmount(data.sumOfEquivalentDue.amount);
                self.loansCards.push({
                    url: self.nameParser("CCA"),
                    count: count,
                    amount: data.sumOfEquivalentDue.amount,
                    currency: data.domesticCurrency
                });
            } else {
                self.loansCards.push({
                    url: self.nameParser("CCA"),
                    count: 0,
                    amount: 0,
                    currency: data.domesticCurrency
                });
                self.doneCredit(true);
            }
            self.doneCredit(true);
        }).fail(function () {
            self.loansCards.push({
                url: self.nameParser("CCA"),
                count: 0,
                amount: 0,
                currency: "GBP"
            });
            self.doneCredit(true);
        });
        self.paymentsUrl = { url: "payments" };
        var l = self.dataFetchedFromServer().length;
        for (i = 0; i < l; i++) {
            if (self.dataFetchedFromServer()[i].accountType === "CSA") {
                self.loansCards.push({
                    url: self.nameParser(self.dataFetchedFromServer()[i].accountType),
                    count: self.dataFetchedFromServer()[i].count,
                    clickable: true,
                    amount: self.dataFetchedFromServer()[i].amount,
                    currency: self.dataFetchedFromServer()[i].currency || "GBP"
                });
            }
            if (self.dataFetchedFromServer()[i].accountType === "LON") {
                self.loansCards.push({
                    url: self.nameParser(self.dataFetchedFromServer()[i].accountType),
                    count: self.dataFetchedFromServer()[i].count,
                    clickable: true,
                    amount: self.dataFetchedFromServer()[i].amount,
                    currency: self.dataFetchedFromServer()[i].currency || "GBP"
                });
            }
            if (self.dataFetchedFromServer()[i].accountType === "TRD") {
                self.loansCards.push({
                    url: self.nameParser(self.dataFetchedFromServer()[i].accountType),
                    count: self.dataFetchedFromServer()[i].count,
                    clickable: true,
                    amount: self.dataFetchedFromServer()[i].amount,
                    currency: self.dataFetchedFromServer()[i].currency || "GBP"
                });
            }
        }
        var itemsOrdered = [];
        var theOrder = [
            "demand-deposits",
            "term-deposits",
            "loans",
            "cards"
        ];
        for (i = 0; i < theOrder.length; i++) {
            for (var j = 0; j < self.loansCards().length; j++) {
                if (theOrder[i] === self.loansCards()[j].url) {
                    itemsOrdered.push(self.loansCards()[j]);
                }
            }
        }
        self.loansCards([]);
        self.loansCards(itemsOrdered);
        self.dataFetched(true);
        function preProcessData(response) {
            var casaCount = 0, tdCount = 0, loanCount = 0;
            var casaAmount = 0, tdAmount = 0, loanAmount = 0;
            var currency = "";
            var casaResponse = {};
            var tdResponse = {};
            var loanResponse = {};
            var modifiedResponse = [];
            for (var i = 0; i < response.length; i++) {
                if (response[i].accountType === "CSA") {
                    casaCount = casaCount + response[i].count;
                    casaAmount = casaAmount + response[i].totalAvailableBalance.amount + response[i].totalISLAvailableBalance.amount;
                    currency = response[i].totalAvailableBalance.currency;
                    casaResponse.count = casaCount;
                    casaResponse.amount = casaAmount;
                    casaResponse.currency = currency;
                    casaResponse.accountType = response[i].accountType;
                }
                if (response[i].accountType === "TRD") {
                    tdCount = tdCount + response[i].count;
                    tdAmount = tdAmount + response[i].totalActiveAvailableBalance.amount + response[i].totalISLActiveAvailableBalance.amount;
                    currency = response[i].totalActiveAvailableBalance.currency;
                    tdResponse.count = tdCount;
                    tdResponse.amount = tdAmount;
                    casaResponse.currency = currency;
                    tdResponse.accountType = response[i].accountType;
                }
                if (response[i].accountType === "LON") {
                    loanCount = loanCount + response[i].count;
                    loanAmount = loanAmount + response[i].totalActiveOutstandingBalance.amount + response[i].totalISLActiveOutstandingBalance.amount;
                    currency = response[i].totalActiveOutstandingBalance.currency;
                    loanResponse.count = loanCount;
                    loanResponse.amount = loanAmount;
                    casaResponse.currency = currency;
                    loanResponse.accountType = response[i].accountType;
                }
            }
            modifiedResponse.push(casaResponse);
            modifiedResponse.push(tdResponse);
            modifiedResponse.push(loanResponse);
            return modifiedResponse;
        }
        ListingModel.fetchAccounts().then(function(data){
          self.dataFetchedFromServer(preProcessData(data.summary.items));
          var loanArray = data.accounts.filter(function (item) {
              return item.type === "LON";
          });
          for (i = 0; i < loanArray.length; i++) {
              if (loanArray[i].module === "ISL") {
                  self.islamicLoanAccountsPresent(true);
                  break;
              }
          }
        });
    };
});
