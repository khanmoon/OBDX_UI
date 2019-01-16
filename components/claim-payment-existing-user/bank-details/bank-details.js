define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/bank-details",
    "ojs/ojinputtext",
    "ojs/ojlistview",
    "ojs/ojtrain",
    "ojs/ojselectcombobox"
], function (oj, ko, $, GlobalPayeeModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(GlobalPayeeModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.bankdetailsModel = getNewKoModel().bankdetailsModel;
        self.payments = ResourceBundle.payments;
        self.common = ResourceBundle.common;
        self.onBoardingModel = getNewKoModel().onBoardingModel;
        self.externalReferenceId = ko.observable();
        self.validationTracker = ko.observable();
        self.accountName = ko.observable();
        self.isBranchListLoaded = ko.observable(false);
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.branchList = ko.observableArray();
        self.srcAccount = ko.observable();
        self.ifsc = ko.observable();
        self.version = ko.observable();
        self.etagArray = ko.observableArray();
        self.partyId = ko.observable();
        self.uid = ko.observable();
        self.selectedBranch = ko.observable();
        self.bankCodeLocal = ko.observable();
        self.performUpdate = ko.observable(false);
        self.additionalBankDetails = ko.observable({ "code": "" });
        self.clearingCodeType = ko.observable("NEFT");
        self.bankDetails = ko.observable(false);
        rootParams.dashboard.headerName(self.payments.peertopeer.accountInformation);
        self.accountWithArray = [
            {
                id: "thisBank",
                label: self.payments.peertopeer.globalpayee.thisBank
            },
            {
                id: "otherBank",
                label: self.payments.peertopeer.globalpayee.otherBank
            }
        ];
        self.accountWith = ko.observable(self.accountWithArray[0].id);
        self.showIFSC = ko.observable(false);
        self.accountWithChange = function (event, ui) {
            if (ui.option === "checked") {
                if (self.accountWith() === "thisBank") {
                    self.showIFSC(false);
                } else {
                    self.showIFSC(true);
                }
            }
        };
        GlobalPayeeModel.init();
        self.bankdetailsModel.firstName(self.partyDetails() !== "" ? self.partyDetails().firstName : self.userDetails().firstName);
        self.lastName = ko.observable(self.partyDetails() !== "" ? self.partyDetails().lastName : self.userDetails().lastName);
        self.email = ko.observable(self.partyDetails() !== "" ? self.partyDetails().email : self.userDetails().email.displayValue);
        self.etagHandler = function (data) {
            self.version(data.getResponseHeader("ETag") ? data.getResponseHeader("ETag") : 1);
            if (self.performUpdate()) {
                var payload = ko.toJSON(self.bankdetailsModel);
                GlobalPayeeModel.confirmUser(self.version() !== null ? self.version() : rootParams.rootModel.version() !== null ? rootParams.rootModel.version() : "1", payload).done(function () {
                    self.srcAccount(self.bankdetailsModel.accountId());
                    self.stageOne(false);
                    self.stageTwo(true);
                });
            }
        };
        self.createUser = function () {
            rootParams.dashboard.headerName(self.payments.peertopeer.globalpayee.review);
            self.version(null);
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            GlobalPayeeModel.readUser(self.aliasValue().toLowerCase(), self.aliasType()).done(function (data) {
                data = data.globalPayee;
                self.version(data.version);
                if (data.aliasValue) {
                    self.isGlobalPayeeCreated(true);
                    self.confirmUser();
                } else {
                    self.onBoardingModel.aliasValue(self.aliasValue().toLowerCase());
                    self.onBoardingModel.aliasType(self.aliasType());
                    self.onBoardingModel.emailId.value(self.userDetails().email.value || self.email());
                    self.onBoardingModel.firstName(self.partyDetails() !== "" ? self.partyDetails().firstName : self.userDetails().firstName);
                    self.onBoardingModel.lastName(self.partyDetails() !== "" ? self.partyDetails().lastName : self.userDetails().lastName);
                    var payload = ko.toJSON(self.onBoardingModel);
                    GlobalPayeeModel.createUser(payload).done(function (data) {
                        self.globalPayeeData(data);
                        self.version(1);
                        self.confirmUser();
                    });
                }
            });
        };
        self.cancelUser = function () {
            window.location = "/index.html?module=home";
        };
        self.confirmUser = function () {
            self.bankdetailsModel.aliasValue(self.aliasValue().toLowerCase());
            self.bankdetailsModel.aliasType(self.aliasType());
            self.bankdetailsModel.partyId(rootParams.rootModel.partyId());
            if (self.accountWith() === "thisBank") {
                self.bankdetailsModel.payeeType("INTERNAL");
                var accountId = self.bankdetailsModel.accountId();
                self.bankdetailsModel.accountId(accountId);
            } else if (self.accountWith() === "otherBank") {
                self.bankdetailsModel.payeeType("DOMESTIC");
                if (self.additionalBankDetails() !== null) {
                    self.ifsc(self.additionalBankDetails().code);
                }
                self.bankdetailsModel.bankCode(self.ifsc());
            }
            self.bankdetailsModel.paymentId(self.paymentId());
            self.bankdetailsModel.uId(self.globalPayeeData().uId ? self.globalPayeeData().uId : "");
            self.performUpdate(true);
            if (self.version()) {
                var payload = ko.toJSON(self.bankdetailsModel);
                GlobalPayeeModel.confirmUser(self.version(), payload).done(function () {
                    self.srcAccount(self.bankdetailsModel.accountId());
                    self.stageOne(false);
                    self.stageTwo(true);
                }).fail(function () {
                    self.bankdetailsModel.accountId(null);
                });
            }
        };
        self.confirmPayment = function () {
            GlobalPayeeModel.confirmPayment(self.paymentId()).done(function (data, status, jqXHR) {
                self.externalReferenceId(data.transactionNumber);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.transactionNumber,
                    transactionName: self.payments.peertopeer.accountInformation,
                    template: "confirm-screen/claim-payment-template"
                }, self);
            });
        };
        self.cancelPayment = function () {
            self.bankdetailsModel.accountId(self.bankdetailsModel.accountId());
            self.stageOne(true);
            self.additionalBankDetails(null);
            self.stageTwo(false);
        };
        self.done = function () {
            window.location = "/index.html?module=home";
        };
        self.openLookup = function () {
            $("#menuButtonDialog").trigger("openModal");
        };
        self.resetCode = function () {
            self.additionalBankDetails({ "code": "" });
            self.bankDetails(false);
        };
        var error;
        self.verifyCode = function () {
            var code;
            code = oj.Components.getWidgetConstructor($("#swiftCode"));
            code("validate");
            if (self.additionalBankDetails() !== null) {
                self.ifsc(self.additionalBankDetails().code);
            }
            if (self.additionalBankDetails().code.length < 1) {
                error = true;
            } else if (self.additionalBankDetails().code.length > 11) {
                error = true;
                throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.payments.peertopeer.globalpayee.invalidError));
            }
            if (!error) {
                GlobalPayeeModel.getBankDetailsDCC(self.ifsc()).done(function (data) {
                    self.additionalBankDetails(data);
                    self.bankDetails(true);
                }).fail(function () {
                    self.resetCode();
                });
            }
            error = false;
        };
    };
});