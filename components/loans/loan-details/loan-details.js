define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/loan-details"
], function (ko, $, ViewLoansModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        rootParams.dashboard.headerName(self.locale.loanDetails.viewDetails);
        self.loanViewDetails = ko.observable();
        self.loanAccountDTO = ko.observable();
        self.loanAccountDetailsResponseDTO = ko.observable();
        self.scheduleData = ko.observable();
        self.outstandingData = ko.observable();
        self.dataFetched = ko.observable(false);
        self.selectedAccount = ko.observable(self.params.id ? self.params.id.value : null);
        self.additionalLoanDetails = ko.observable();
        rootParams.baseModel.setwebhelpID("loans-details");
        self.getItemInitialDisplay = function (index) {
            return index < 3 ? "" : "none";
        };
        rootParams.baseModel.registerComponent("loan-schedule", "loans");
        rootParams.baseModel.registerComponent("loan-repayment", "loans");
        rootParams.baseModel.registerComponent("loan-disbursement", "loans");
        rootParams.baseModel.registerComponent("account-nickname", "accounts");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("account-input");
        self.fetchDetails = function (accountNumber) {
            $.when(ViewLoansModel.fetchAccountInfo(accountNumber), ViewLoansModel.fetchScheduleInfo(accountNumber), ViewLoansModel.fetchOutstandingInfo(accountNumber)).done(function (loanViewDetails, scheduleData, outstandingData) {
                self.loanViewDetails(loanViewDetails.loanAccountDetails);
                self.scheduleData(scheduleData.loanScheduleDTO);
                self.outstandingData(outstandingData.outStandingLoanDetailsDTO);
                self.dataFetched(true);
            });
        };
        self.showFloatingPanel = function () {
            $("#panelLoans").trigger("openFloatingPanel");
        };
        if (self.selectedAccount()) {
            self.fetchDetails(self.selectedAccount());
        }
        self.selectedAccount.subscribe(function (newValue) {
            self.dataFetched(false);
            self.fetchDetails(newValue);
        });
    };
});