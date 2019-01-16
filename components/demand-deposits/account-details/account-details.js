define([
    "knockout",
    "./model",
    "jquery",

    "ojL10n!resources/nls/account-details",
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
        self.accountTransactionCurrency = ko.observable();
        self.nls = resourceBundle;
        self.pageData = ko.observable();
        self.nicknameDetails = ko.observable();
        self.nicknameAvailable = ko.observable(false);
        rootParams.dashboard.headerName(self.nls.accountDetails.labels.accountDetails);
        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerComponent("account-transactions", "accounts");
        rootParams.baseModel.registerComponent("account-nickname", "accounts");
        rootParams.baseModel.registerComponent("statement-request", "accounts");
        rootParams.baseModel.registerComponent("cheque-book-request", "demand-deposits");
        rootParams.baseModel.registerComponent("cheque-status-inquiry", "demand-deposits");
        rootParams.baseModel.registerComponent("cheque-stop-unblock", "demand-deposits");
        rootParams.baseModel.registerComponent("quick-links", "widgets/dashboard");
        self.taskCode = ko.observable();
        self.selectedSettlementAccount = ko.observable(self.params.id ? self.params.id.value : null);
        self.additionalDetails = ko.observable();
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("action-header");
        self.balanceHeading = ko.observable("balances");
        self.limitsHeading = ko.observable("limits");
        self.facilitiesHeading = ko.observable("facilities");
        self.accountNumber = ko.observable();
        self.fetchDetails = function () {
            componentModel.fetchAccountDetails(ko.utils.unwrapObservable(self.params.id.value)).done(function (data) {
                self.nicknameAvailable(false);
                self.pageData(data.demandDepositAccountDTO);
                self.accountTransactionCurrency(data.demandDepositAccountDTO.currencyCode);
                self.nicknameDetails(data.demandDepositAccountDTO);
                self.nicknameAvailable(true);
            });
        };
        self.fetchDetails();
        self.selectedSettlementAccount.subscribe(function (newValue) {
            self.accountNumber(newValue);
            componentModel.fetchAccountDetails(newValue).done(function (data) {
                self.nicknameAvailable(false);
                self.pageData(data.demandDepositAccountDTO);
                self.nicknameDetails(data.demandDepositAccountDTO);
                self.nicknameAvailable(true);
            });
        });
    };
});