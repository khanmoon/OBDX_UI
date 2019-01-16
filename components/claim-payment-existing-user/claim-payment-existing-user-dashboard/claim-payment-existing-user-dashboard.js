define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "framework/js/constants/constants",
    "ojL10n!resources/nls/claim-payment",
    "ojs/ojinputnumber",
    "ojs/ojtrain",
    "ojs/ojknockout-validation",
    "platform"
], function (oj, ko, $, DashboardModel, Constants, ResourceBundle, Platform) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.payments = ResourceBundle.payments;
        self.common = ResourceBundle.common;
        self.header = ko.observable(self.payments.peertopeer.recievepayment);
        self.stageOne = ko.observable(false);
        self.aliasValue = ko.observable();
        self.paymentId = ko.observable();
        self.user = ko.observable();
        self.aliasType = ko.observable();
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("bank-look-up");
        self.partyDetails = ko.observable();
        self.userDetails = ko.observable();
        self.externalReferenceId = ko.observable();
        self.isExistingGlobalPayee = ko.observable(true);
        self.isGlobalPayeeCreated = ko.observable(false);
        self.isUpdateDetails = ko.observable(false);
        self.srcAccount = ko.observable(self.payments.peertopeer.accnotselected);
        self.branchName = ko.observable("");
        self.accountType = ko.observable("");
        self.ifscCode = ko.observable("");
        self.version = ko.observable();
        self.partyId = ko.observable();
        DashboardModel.init();
        self.globalPayeeData = ko.observable();
        rootParams.dashboard.headerName(self.payments.peertopeer.accountInformation);
        rootParams.baseModel.registerComponent("bank-details", "claim-payment-existing-user");
        self.fetchQueryParams = function (rootData) {
            if (rootData.queryMap) {
                self.aliasValue(rootData.queryMap.value);
                self.paymentId(rootData.queryMap.id);
                self.user(rootData.queryMap.user);
                self.aliasType(rootData.queryMap.type);
            }
            DashboardModel.fetchLdapUser().done(function (data) {
                self.partyId(data.userProfile.partyId.value);
                self.partyDetails("");
                self.userDetails({
                    firstName: data.userProfile.firstName,
                    lastName: data.userProfile.lastName,
                    email: data.userProfile.emailId
                });
                DashboardModel.readUser(self.aliasValue().toLowerCase(), self.aliasType()).done(function (data) {
                    data = data.globalPayee;
                    self.version(data.version);
                    if (data.accountId) {
                        if (data.payeeType === "DOMESTIC") {
                            self.accountType("DOMESTIC");
                            self.ifscCode(data.bankCode);
                            self.srcAccount(data.accountId);
                        } else if (data.payeeType === "INTERNAL") {
                            self.accountType("INTERNAL");
                            self.srcAccount(data.accountId);
                        }
                    } else {
                        if (data.aliasValue !== null) {
                            self.isGlobalPayeeCreated(true);
                        } else {
                            self.isGlobalPayeeCreated(false);
                        }
                        self.isExistingGlobalPayee(false);
                    }
                    self.globalPayeeData(data);
                    self.stageOne(true);
                });
            });
        };
        self.updateDetails = function () {
            self.isExistingGlobalPayee(false);
            self.isUpdateDetails(true);
        };
        self.cancelPayment = function () {
            window.location = "/index.html?module=home";
        };
        self.logOut = function () {
            window.onbeforeunload = null;
            if (Constants.authenticator === "OBDXAuthenticator") {
                DashboardModel.logoutDBAuth();
            } else {
                DashboardModel.logout(function () {
                    Platform.getInstance().then(function (platform) {
                        platform("logOut");
                    });
                });
            }
        };
        self.confirmPayment = function () {
            DashboardModel.confirmPayment(self.paymentId()).done(function (data, status, jqXHR) {
                self.stageOne(false);
                self.externalReferenceId(data.transactionNumber);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.transactionNumber,
                    transactionName: self.payments.peertopeer.titleRetail,
                    template: "confirm-screen/claim-payment-template"
                }, self);
            });
        };
        self.done = function () {
            window.location = "/index.html?module=home";
        };
    };
});