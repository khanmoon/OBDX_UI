define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "framework/js/constants/constants",
    "ojL10n!resources/nls/loan-disbursement",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojlistview"
], function (oj, ko, $, ViewLoansDisbursementModel, Constants, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        self.constants = Constants;
        rootParams.dashboard.headerName(self.locale.disbursement.disbursementDetails);
        rootParams.baseModel.setwebhelpID("loans-disbursement");
        self.disbursementData = ko.observableArray();
        self.loanDetails = ko.observable();
        self.accountNumberSelected = ko.observable();
        self.additionalDetails = ko.observable();
        self.detailsFetched = ko.observable(false);
        rootParams.baseModel.registerElement("date-box");
        rootParams.baseModel.registerComponent("account-nickname", "accounts");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("account-input");
        self.getItemInitialDisplay = function (index) {
            return index < 3 ? "" : "none";
        };
        self.datasource = new oj.ArrayTableDataSource(self.disbursementData, { idAttribute: "id" });
        self.mainFunction = function (accountNumber, fireAccountRead) {
            $.when(ViewLoansDisbursementModel.fetchDisbursementInfo(accountNumber), fireAccountRead ? ViewLoansDisbursementModel.fetchAccountRead(accountNumber) : void 0).done(function (disbursementData, accountDetails) {
                if (fireAccountRead && accountDetails) {
                    self.loanDetails(accountDetails.loanAccountDetails);
                } else if (!self.accountNumber) {
                    self.loanDetails(self.params);
                } else {
                    self.loanDetails(ko.utils.unwrapObservable(self.loanViewDetails()));
                }
                self.disbursementData.removeAll();
                for (var i = 0; i < disbursementData.loanDisbursementDetailsDTOs.length; i++) {
                    self.disbursementData.push({
                        id: disbursementData.loanDisbursementDetailsDTOs[i].accountId.value,
                        date: disbursementData.loanDisbursementDetailsDTOs[i].date,
                        amount: rootParams.baseModel.formatCurrency(disbursementData.loanDisbursementDetailsDTOs[i].amount.amount, self.loanDetails().approvedAmount.currency)
                    });
                }
                self.detailsFetched(true);
            });
        };
        self.checkAccountDropDown = ko.computed(function () {
            if (self.accountNumberSelected()) {
                self.mainFunction(self.accountNumberSelected(), true);
                self.loanDetails("");
            }
        }, self);
        self.dispose = function () {
            self.checkAccountDropDown.dispose();
        };
        if (self.params.id) {
            self.accountNumberSelected(self.params.id.value);
            self.mainFunction(self.params.id.value, false);
        }
    };
});