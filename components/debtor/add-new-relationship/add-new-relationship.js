define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/add-new-relationship",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton"
], function (oj, ko, $, newDebtorModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(newDebtorModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, Params.rootModel);
        self.validationTracker = Params.validator;
        self.validationTracker = ko.observable();
        self.debtor = getNewKoModel().debtorModel;
        self.debtors = ResourceBundle.debtors;
        self.common = ResourceBundle.common;
        self.debtorName = getNewKoModel().debtorName;
        self.debtorGroupDetails = self.payerGroupData;
        self.debtorName.name(self.debtorGroupDetails.name);
        self.debtor.groupId(self.debtorGroupDetails.id);
        Params.dashboard.headerName(self.debtors.addnewdebtors);
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.stageThree = ko.observable(false);
        self.name = ko.observable();
        self.authKey = ko.observable();
        self.invalidOtpEntered = ko.observable(false);
        self.showDebtorDetails = ko.observable(false);
        self.componentName = ko.observable("debtor-details");
        self.payerId = ko.observable();
        Params.baseModel.registerElement("confirm-screen");
        Params.baseModel.registerComponent("otp-verification", "payments");
        Params.baseModel.registerComponent("payments-money-transfer", "payments");
        Params.baseModel.registerComponent("debtor-group-list", "debtor");
        self.addDebtor = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            var debtor = ko.toJSON(self.debtor);
            newDebtorModel.createNewPayer(debtor, self.debtor.groupId()).done(function (data2) {
                self.payerId(data2.domesticPayer.id);
                self.stageOne(false);
                self.stageTwo(true);
            });
        };
        self.cancelAddDebtor = function () {
            history.back();
        };
        self.cancelStageTwo = function () {
            newDebtorModel.deleteDebtor(self.payerId(), self.debtor.groupId()).done(function () {
                newDebtorModel.deleteDebtorGroup(self.debtor.groupId()).done(function () {
                    self.stageOne(true);
                    self.stageTwo(false);
                });
            });
        };
        self.cancelStageThree = function () {
            self.stageOne(true);
            self.stageTwo(false);
            self.stageThree(false);
        };
        self.confirmAddDebtor = function () {
            newDebtorModel.confirmAddDebtor(self.payerId(), self.debtor.groupId()).done(function (data, status, jqXHR) {
                if (data.tokenAvailable) {
                    self.stageTwo(false);
                    self.stageThree(true);
                } else {
                    self.stageOne(false);
                    self.stageTwo(false);
                    Params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        hostReferenceNumber: data.externalReferenceId,
                        transactionName: self.debtors.confirmAddDebtor,
                        template: "confirm-screen/payments-template"
                    }, self);
                }
            });
        };
        self.resendOTP = function () {
            newDebtorModel.confirmAddDebtor(self.payerId(), self.debtor.groupId());
        };
        self.confirmAddDebtorWithAuth = function (data, status, jqXHR) {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            newDebtorModel.confirmAddDebtorWithAuth(self.payerId(), self.debtor.groupId(), self.authKey()).done(function (data) {
                if (data.tokenValid) {
                    self.stageThree(false);
                    Params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        hostReferenceNumber: data.externalReferenceId,
                        transactionName: self.debtors.confirmAddDebtor,
                        template: "confirm-screen/payments-template"
                    }, self);
                } else {
                    self.invalidOtpEntered(true);
                }
            });
        };
        self.CanceladdDebtor = function () {
            history.back();
        };
    };
});