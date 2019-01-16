define([
    "knockout",
    "./model",
    "jquery",

    "ojL10n!resources/nls/loan-corporate-details",
    "ojs/ojcore",
    "ojs/ojknockout",
    "ojs/ojbutton",
    "ojs/ojchart",
    "ojs/ojvalidation"
], function (ko, componentModel, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.orientationValue = ko.observable("vertical");
        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.loanDetails.labels.loanDetails);
        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerComponent("account-transactions", "accounts");
        rootParams.baseModel.registerComponent("loan-schedule", "loans");
        rootParams.baseModel.registerComponent("loan-repayment", "loans");
        rootParams.baseModel.registerComponent("loan-disbursement", "loans");
        rootParams.baseModel.registerComponent("quick-links", "widgets/dashboard");
        self.accountTransactionCurrency = ko.observable();
        self.outstandingData = ko.observable();
        self.scheduleData = ko.observable();
        self.loanViewDetails = ko.observable();
        self.selectedSettlementAccount = ko.observable(self.params.id ? self.params.id.value : null);
        self.additionalDetails = ko.observable();
        self.nicknameDetails = ko.observable();
        self.nicknameAvailable = ko.observable(false);
        rootParams.baseModel.registerComponent("account-nickname", "accounts");
        rootParams.baseModel.registerElement("action-header");
        self.balanceHeading = ko.observable("balances");
        self.limitsHeading = ko.observable("limits");
        self.facilitiesHeading = ko.observable("facilities");
        self.accountNumber = ko.observable(self.params.id ? self.params.id.value : null);
        function fetchData() {
            $.when(componentModel.fetchLoanDetails(ko.utils.unwrapObservable(self.accountNumber())), componentModel.fetchOutstandingDetails(ko.utils.unwrapObservable(self.accountNumber())), componentModel.fetchLoanScheduleDetails(ko.utils.unwrapObservable(self.accountNumber()))).done(function (loanDetails, loanOutstanding, loanSchedule) {
                self.nicknameAvailable(false);
                self.loanViewDetails(loanDetails.loanAccountDetails);
                self.accountTransactionCurrency(loanDetails.loanAccountDetails.approvedAmount.currency);
                self.outstandingData(loanOutstanding.outStandingLoanDetailsDTO);
                self.scheduleData(loanSchedule.loanScheduleDTO);
                self.nicknameDetails(loanDetails.loanAccountDetails);
                self.nicknameAvailable(true);
            });
        }
        fetchData();
        self.selectedSettlementAccount.subscribe(function (newValue) {
            self.accountNumber(newValue);
            fetchData();
        });
        self.fetchDetails = function () {
            fetchData();
        };
    };
});