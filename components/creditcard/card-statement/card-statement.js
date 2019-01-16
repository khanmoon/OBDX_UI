define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/statements",
    "ojs/ojknockout",
    "ojs/ojlistview",
    "ojs/ojmodel",
    "ojs/ojselectcombobox",

    "ojs/ojpagingcontrol",

    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojdatetimepicker",
    "ojs/ojfilmstrip",
    "ojs/ojbutton",
    "ojs/ojmenu",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation",
    "promise"
], function (oj, ko, $, AccountStatement, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.cardObject = ko.observable(self.params);
        self.selectedCardValue = ko.observable();
        self.creditCardLoaded = ko.observable(false);
        self.primaryCreditCard = ko.observableArray([]);
        self.cardStatementFetched = ko.observable(false);
        self.cardOwnerName = ko.observable();
        self.maskedAccountNumber = ko.observable();
        self.cardStatementsArray = ko.observableArray([]);
        self.txnType = ko.observable("");
        self.showBillingMonthDropdown = ko.observable(false);
        self.availableMonths = ko.observableArray([]);
        self.selectedMonth = ko.observable("");
        self.selectedYear = ko.observable("");
        self.monthSelected = ko.observable(false);
        self.componentName = ko.observable("date-box");
        self.resource = ResourceBundle;
        self.constants = null;
        rootParams.dashboard.headerName(self.resource.statements.cardHeading);
        self.showeStatement = ko.observable(false);
        self.showDownloadPregenerated = ko.observable(false);
        self.eStatementSubsciptionDetails = ko.observable();
        self.moduleURL = ko.observable();
        if (self.params.id) {
            self.selectedCardValue(self.params.id.value);
        }
        if (self.params.jsonData) {
            self.moduleURL(self.params.jsonData.moduleURL);
        }
        rootParams.baseModel.registerComponent("e-statement", "creditcard");
        rootParams.baseModel.registerComponent("download-statement", "creditcard");
        rootParams.baseModel.registerComponent("reset-pin", "creditcard");
        rootParams.baseModel.registerComponent("auto-pay", "creditcard");
        rootParams.baseModel.registerComponent("add-on-card", "creditcard");
        rootParams.baseModel.registerComponent("card-pay", "creditcard");
        rootParams.baseModel.registerComponent("block-card", "creditcard");
        rootParams.baseModel.registerComponent("request-pin", "creditcard");
        self.selectedCardValue.subscribe(function (newValue) {
            if (newValue) {
                self.txnType(null);
                self.txnType("UBT");
            }
        });
        var ccArr = self.cardObject(), primaryCardArray = [];
        if (ccArr.cardType === "PRIMARY") {
            primaryCardArray.push(ccArr);
        }
        if (primaryCardArray.length > 0) {
            self.primaryCreditCard(primaryCardArray);
            for (var i = 0; i < primaryCardArray.length; i++) {
                if (primaryCardArray[i].creditCard.value === self.selectedCardValue()) {
                    self.cardOwnerName(primaryCardArray[i].ownerName);
                }
            }
            self.creditCardLoaded(true);
        }
        self.showFloatingPanel = function () {
            $("#panelCreditCard2").trigger("openFloatingPanel");
        };
        self.prepareSuccessData = function (data) {
            var v = 0;
            var arr = [];
            var statmentDate = null;
            self.cardStatementsArray(arr);
            if (data.statement) {
                for (var i = 0; i < data.statement.length; i++) {
                  if(data.statement[i].statementDate){
                    statmentDate = data.statement[i].statementDate;
                    }
                    for (var j = 0; j < data.statement[i].statmentItem.length; j++) {
                        var k = data.statement[i].statmentItem[j];
                        k.cardDet = data.statement[i].cardProductDTO + "" + data.statement[i].cardOwnershipType + "-" + data.statement[i].number.displayValue + "-" + k.transactionDescription;
                        k.uniqueId = "cc-statement" + v;
                        delete k.hash;
                        delete k.slNo;
                        arr.push(k);
                        v++;
                    }
                }
                if (arr.length > 0) {
                    arr.sort(function (a, b) {
                        return new Date(b.transactionDate) - new Date(a.transactionDate);
                    });
                    self.cardStatementsArray(arr);
                }
                self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.cardStatementsArray), { idAttribute: "uniqueId" });
                self.cardStatementFetched(true);
                if (self.txnType() === "BT" && self.selectedMonth() === "" && arr.length > 0) {
                    self.showBillingMonthDropdown(false);
                    var pattern = /(\d{2})\-(\d{2})\-(\d{4})/;
                    statmentDate=statmentDate.substring(0,4)+"-"+statmentDate.substring(5,7)+"-"+statmentDate.substring(8,10);
                    var stmtDate = new Date(statmentDate.replace(pattern, "$3-$2-$1"));
                    self.availableMonths.removeAll();
                    for (var a = 0; a < 12; a++) {
                        self.availableMonths.push({
                            text: rootParams.baseModel.formatDate(stmtDate+"", "monthYearFormat"),
                            value: stmtDate.getMonth() + "-" + stmtDate.getFullYear()
                        });
                        stmtDate.setMonth(stmtDate.getMonth() - 1);
                    }
                    self.showBillingMonthDropdown(true);
                }
            }
        };
        var firstTime = true;
        self.accountChanged = function (event) {
            self.cardStatementFetched(false);
            if (firstTime) {
                self.fetchStatement(self.selectedCardValue());
                firstTime = false;
            } else if (event.detail.value !== event.detail.previousValue) {
                self.fetchStatement(event.detail.value);
            }
        };
        self.fetchStatement = function (cardId) {
            var selectedCardDetails = null;
            for (var i = 0; i < self.primaryCreditCard().length; i++) {
                if (self.primaryCreditCard()[i].primaryCardId.value === cardId) {
                    selectedCardDetails = self.primaryCreditCard()[i];
                    break;
                }
            }
            self.selectedCardValue(selectedCardDetails.creditCard.value);
            self.cardOwnerName(selectedCardDetails.ownerName);
            self.selectedMonth("");
            self.monthSelected(false);
            self.txnType("UBT");
            self.showBillingMonthDropdown(false);
            AccountStatement.fetchUnbilledStatements(self.selectedCardValue()).done(self.prepareSuccessData);
        };
        self.txnTypeChangedHandler = function (event) {
            self.cardStatementFetched(false);
            if (event.detail.value !== "") {
                var i = event.detail.value;
                self.txnType(i);
                self.monthSelected(false);
                if (i === "UBT") {
                    self.showBillingMonthDropdown(false);
                    self.selectedMonth("");
                    AccountStatement.fetchUnbilledStatements(self.selectedCardValue()).done(self.prepareSuccessData);
                } else {
                    AccountStatement.fetchBilledStatements(self.selectedCardValue()).done(self.prepareSuccessData);
                }
            }
        };
        self.txnMonthChangeHandler = function (event) {
            if (event.detail.value !== "") {
                var i = event.detail.value;
                var j = i.split("-");
                self.selectedMonth(j[0]);
                self.selectedYear(j[1]);
                self.monthSelected(true);
                if (self.selectedMonth() !== "") {
                    AccountStatement.fetchBilledStatements(self.selectedCardValue(), self.selectedMonth(), self.selectedYear()).done(self.prepareSuccessData);
                } else {
                    AccountStatement.fetchBilledStatements(self.selectedCardValue()).done(self.prepareSuccessData);
                }
            }
        };
        self.downloadStatement = function () {
            if (self.txnType() === "UBT") {
                AccountStatement.downloadUnbilledStatement(ko.utils.unwrapObservable(self.selectedCardValue()));
            } else {
                AccountStatement.downloadBilledStatement(ko.utils.unwrapObservable(self.selectedCardValue()), self.selectedMonth(), self.selectedYear());
            }
        };
        self.eStatementSubsciption = function () {
            AccountStatement.fetchEStatements(self.selectedCardValue()).done(function (data) {
                self.eStatementSubsciptionDetails(data.eStatementsPreferencesDTO);
                self.showeStatement(true);
                self.showDownloadPregenerated(false);
                $("#statementDialog").trigger("openModal");
            });
        };
        self.downloadPregenerated = function () {
            self.showeStatement(false);
            self.showDownloadPregenerated(true);
            $("#statementDialog").trigger("openModal");
        };
        self.creditCardParser = function (data) {
            data.accounts = data.creditcards;
            data.accounts.map(function (creditCard) {
                creditCard.id = creditCard.creditCard;
                creditCard.partyId = data.associatedParty;
                creditCard.accountNickname = creditCard.cardNickname;
                creditCard.associatedParty = data.associatedParty;
                return creditCard;
            });
            return data;
        };
    };
});
