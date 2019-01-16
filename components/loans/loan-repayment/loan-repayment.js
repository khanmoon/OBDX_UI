define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/loan-repayment",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation"
], function (oj, ko, $, ViewLoansRepayModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.loanAccountAdditionalDetails = ko.observable();
        self.settlementAccountAdditionalDetails = ko.observable();
        self.validationTracker = ko.observable();
        self.outstandingDataFetched = ko.observable(false);
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        var confirmScreenExtensions = {};
        rootParams.baseModel.setwebhelpID("loans-repayment");
        rootParams.baseModel.registerElement("amount-input");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("account-nickname", "accounts");
        rootParams.baseModel.registerComponent("review-loan-repayment", "loans");
        rootParams.dashboard.headerName(self.locale.repayment.heading);
        var getNewKoModel = function () {
            return ko.mapping.fromJS(ViewLoansRepayModel.getNewModel());
        };
        self.rootModelInstance = self.rootModelInstance || getNewKoModel();
        function getOutstandingData() {
            self.outstandingDataFetched(false);
            ViewLoansRepayModel.fetchOutstandingInfo(self.rootModelInstance.loanAccountId.value()).done(function (data) {
                self.rootModelInstance.installmentArrears.amount(data.outStandingLoanDetailsDTO.installmentArrear.amount);
                self.rootModelInstance.installmentArrears.currency(data.outStandingLoanDetailsDTO.installmentArrear.currency);
                self.rootModelInstance.principalBalance.amount(data.outStandingLoanDetailsDTO.principalBalance.amount);
                self.rootModelInstance.principalBalance.currency(data.outStandingLoanDetailsDTO.principalBalance.currency);
                self.rootModelInstance.amount.currency(data.outStandingLoanDetailsDTO.principalBalance.currency);
                self.rootModelInstance.date(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));
                self.outstandingDataFetched(true);
            });
        }
        self.loanAccountIdsubscription = self.rootModelInstance.loanAccountId.value.subscribe(function () {
            getOutstandingData();
        });
        if (self.params.id) {
            self.rootModelInstance.loanAccountId.value(self.params.id.value);
            getOutstandingData();
        }
        self.submitRepaymentRequest = function () {
            ViewLoansRepayModel.createRepaymentRequest(self.rootModelInstance.loanAccountId.value(), ko.mapping.toJSON(self.rootModelInstance, { "ignore": ["loanAccountId"] })).done(function (data, status, jqXhr) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.locale.repayment.heading,
                    eReceiptRequired: true,
                    hostReferenceNumber: data.repaymentDetail ? data.repaymentDetail.key : null,
                    confirmScreenExtensions: confirmScreenExtensions,
                    template: "confirm-screen/loan-template"
                }, self);
            });
        };
        self.tracker = ko.observable();
        self.dispose = function () {
            self.loanAccountIdsubscription.dispose();
        };
        self.confirmButton = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("loanRepaymentID"))) {
                return;
            }
            self.rootModelInstance.loanAccountId.displayValue(self.loanAccountAdditionalDetails().account.id.displayValue);
            self.rootModelInstance.settlementAccountId.displayValue(self.settlementAccountAdditionalDetails().account.id.displayValue);
            rootParams.dashboard.loadComponent("review-loan-repayment", {
                mode: "review",
                data: self.rootModelInstance,
                confirmScreenExtensions: confirmScreenExtensions
            }, self);
        };
    };
});