define([
    "knockout",
    "./model",
    "jquery",

    "ojL10n!resources/nls/td-corporate-details",
    "ojs/ojcore",
    "ojs/ojknockout",
    "ojs/ojbutton",
    "ojs/ojchart",
    "ojs/ojvalidation",
    "ojs/ojmenu"
], function (ko, componentModel, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.orientationValue = ko.observable("vertical");
        self.pageData = ko.observable();
        self.accountTransactionCurrency = ko.observable();
        self.payToData = ko.observable();
        self.branchDetails = ko.observable();
        self.nicknameDetails = ko.observable();
        self.nicknameAvailable = ko.observable(false);
        self.branchDetailsFetched = ko.observable(false);
        self.accountNumber = ko.observable();
        self.selectedSettlementAccount = ko.observable(self.params.id ? self.params.id.value : null);
        self.accountNumber(self.params.id.value);
        function fetchData() {
            componentModel.fetchTdDetails(self.accountNumber()).done(function(data) {
                self.nicknameAvailable(false);
                self.tdViewDetails = ko.observable();
                self.tdViewDetails(data);
                self.pageData(data.termDepositDetails);
                self.accountTransactionCurrency(data.termDepositDetails.currencyCode);
                self.nicknameDetails(self.tdViewDetails().termDepositDetails);
                self.nicknameAvailable(true);
            });
            componentModel.fetchPayoutInstructions(self.accountNumber()).done(function(data) {
                self.payToData(data.payoutInstructions[0]);
                if (self.payToData()) {
                    componentModel.fetchBranchDetails(ko.utils.unwrapObservable(self.payToData().branchId)).done(function (data) {
                        self.branchDetails(data.addressDTO[0]);
                        self.branchDetailsFetched(true);
                    });
                }
            });
        }
        fetchData();
        rootParams.baseModel.registerElement("action-widget");
        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerComponent("account-transactions", "accounts");
        rootParams.baseModel.registerComponent("account-nickname", "accounts");
        rootParams.baseModel.registerComponent("td-open", "term-deposits");
        rootParams.baseModel.registerComponent("td-topup", "term-deposits");
        rootParams.baseModel.registerComponent("td-amend", "term-deposits");
        rootParams.baseModel.registerComponent("td-redeem", "term-deposits");
        rootParams.baseModel.registerComponent("quick-links", "widgets/dashboard");
        self.buttonActions = function (componentName) {
            rootParams.dashboard.loadComponent(componentName, {}, self);
        };
        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.accountDetails.labels.pageHeader);
        self.additionalDetails = ko.observable();
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("action-header");
        self.selectedSettlementAccount.subscribe(function (newValue) {
            self.accountNumber(newValue);
            fetchData();
        });
        self.fetchDetails = function () {
            fetchData();
        };
    };
});