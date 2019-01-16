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
], function (oj, ko, $, AccountActivity, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.detailsFetched = ko.observable(false);
        self.resource = ResourceBundle;
        self.selectedAccountType = ko.observable();
        self.selectedAccType = ko.observable();
        self.accountNumber = ko.observable();
        self.items = ko.observableArray();
        self.allItems = [];
        self.selectedFilmStripAccount = ko.observable();
        self.accountList = ko.observableArray();
        self.accountTypeList = ko.observableArray([
            "CSA",
            "TRD",
            "LON"
        ]);
        self.refreshAccounts = ko.observable(false);
        self.type = ko.observable();
        self.additionalDetails = ko.observable();
        var transactionCount = 3;
        var typeMap = {
            CSA: "demandDeposit",
            TRD: "deposit",
            LON: "loan"
        };
        var moduleTypeMap = {
            CSA: "demand-deposits",
            TRD: "term-deposits",
            LON: "loans"
        };

        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("date-box");
        if (!rootParams.baseModel.large()) {
            transactionCount = 2;
        }
        rootParams.baseModel.registerComponent("account-transactions", "accounts");
        self.searchParameters = {
            searchBy: ko.observableArray(["CPR"]),
            transactionType: ko.observable("A")
        };
        function setPageData(data) {
            var tempData = $.map(data, function (v) {
                var newObj = {};
                newObj.date = v.valueDate ? rootParams.baseModel.formatDate(v.valueDate) : "";
                newObj.description = v.description ? v.description : "";
                newObj.tempAmount = v.amountInAccountCurrency.amount ? v.amountInAccountCurrency.amount : "";
                newObj.tempCurrency = v.amountInAccountCurrency.currency ? v.amountInAccountCurrency.currency : "";
                newObj.amount = v.amountInAccountCurrency.amount ? v.transactionType === "C" ? rootParams.baseModel.format(self.resource.creditType, { amt: rootParams.baseModel.formatCurrency(v.amountInAccountCurrency.amount, v.amountInAccountCurrency.currency) }) : rootParams.baseModel.format(self.resource.debitType, { amt: rootParams.baseModel.formatCurrency(v.amountInAccountCurrency.amount, v.amountInAccountCurrency.currency) }) : "";
                newObj.amountClass = v.amountInAccountCurrency.amount ? v.transactionType === "C" ? "" : "debit" : "";
                newObj.id = v.accountId.value;
                newObj.displayValue = v.accountId.displayValue;
                newObj.transactionType = v.transactionType;
                return newObj;
            });
            return tempData;
        }

        function fetchData(account, fetchIndex) {
            var search = ko.toJSON(self.searchParameters);
            self.items.removeAll();
            AccountActivity.fetchTransactionDetails(ko.utils.unwrapObservable(account), self.type(), search, transactionCount).then(function (data) {
                if (!rootParams.baseModel.small()) {
                    ko.utils.arrayPushAll(self.items, setPageData(data.items));
                } else if (self.allItems.length) {
                    ko.utils.arrayPushAll(self.allItems[fetchIndex].transactions, setPageData(data.items));
                    self.allItems[fetchIndex].loaded(true);
                }
            });
            self.detailsFetched(true);
        }

        self.accountType = function (accData) {
            self.refreshAccounts(false);
            self.detailsFetched(false);
            ko.tasks.runEarly();
            AccountActivity.fetchAccounts().then(function (data) {
            if (data.accounts) {
                self.accountList.removeAll();
                self.allItems.length = 0;
                for (var index = 0; index < data.accounts.length; index++) {
                    if (data.accounts[index].type === accData) {
                        self.accountList.push(data.accounts[index]);
                        if (rootParams.baseModel.small()) {

                            self.allItems.push({
                                account: data.accounts[index],
                                transactions: ko.observableArray(),
                                loaded: ko.observable(false)
                            });
                        }
                    }
                }
                if(self.allItems.length > 0){
                  fetchData(self.allItems[0].account.id.value,0);
                }
                ko.tasks.runEarly();
                self.refreshAccounts(true);
                self.detailsFetched(true);
            }

          });
        };


        if (!rootParams.baseModel.small()) {
        self.accountNumber.subscribe(function (newValue) {
            if (self.accountNumber()) {
                fetchData(newValue);
            }
        });
      }
        self.selectedAccountTypeChangedHandler = function (event) {
            self.accountNumber("");
            self.type(typeMap[event.detail.value]);
            self.selectedAccountType(self.resource[event.detail.value]);
            self.selectedAccType(event.detail.value);
            self.accountType(event.detail.value);
        };
        self.selectedFilmStripAccount.subscribe(function(){
            fetchData(self.allItems[self.selectedFilmStripAccount().index].account.id.value, self.selectedFilmStripAccount().index);
        });

        self.showDashboardView = function () {
            if (self.additionalDetails()) {
                rootParams.dashboard.loadComponent("manage-accounts", ko.utils.extend(self.additionalDetails(), {
                    "applicationType": moduleTypeMap[self.selectedAccType()],
                    "defaultTab": "account-transactions",
                    "type": self.selectedAccType()
                }));
            }
        };
        self.showMobileView = function (data) {
            rootParams.dashboard.loadComponent("manage-accounts", ko.utils.extend(data.account, {
                "applicationType": moduleTypeMap[self.selectedAccType()],
                "defaultTab": "account-transactions",
                "type": self.selectedAccType()
            }));
        };
    };
});
