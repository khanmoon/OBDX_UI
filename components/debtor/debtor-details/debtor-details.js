define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/debtor",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton"
], function (oj, ko, $, debtorModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(debtorModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, Params.rootModel);
        self.validationTracker = Params.validator;
        self.validationTracker = ko.observable();
        self.debtors = ResourceBundle.debtors;
        self.common = ResourceBundle.common;
        self.subPayerDetails = Params.rootModel.params;
        self.debtorDetails = Params.rootModel.params;
        self.debtor = getNewKoModel().debtorDetailsModel;
        Params.dashboard.headerName(self.debtors.managedebtor_header);
        self.stageOne = ko.observable(true);
        self.showDeleteStage = ko.observable(false);
        self.stageTwo = ko.observable(true);
        self.stageThree = ko.observable(false);
        self.stageFour = ko.observable(false);
        self.authKey = ko.observable();
        self.invalidOtpEntered = ko.observable(false);
        self.debtorInfo = ko.observable();
        self.debtorInfo(ko.mapping.fromJS(self.debtor));
        self.editStageOne = ko.observable(false);
        self.editStageTwo = ko.observable(false);
        self.editStageThree = ko.observable(false);
        self.authKey = ko.observable();
        self.invalidOtpEntered = ko.observable(false);
        self.showDebtorDetails = ko.observable(false);
        self.componentName = ko.observable("debtor-details");
        self.debtorName = ko.observable();
        Params.baseModel.registerElement("confirm-screen");
        Params.baseModel.registerComponent("otp-verification", "payments");
        Params.baseModel.registerComponent("debtor-group-list", "debtor");
        Params.baseModel.registerComponent("debtor-money-request", "debtor");
        self.cancelDeleteDebtor = function () {
            self.stageOne(true);
            self.showDeleteStage(false);
        };
        self.deleteDebtor = function () {
            self.stageOne(false);
            self.showDeleteStage(true);
        };
        self.confirmDelete = function () {
            debtorModel.deleteDebtor(self.subPayerDetails.groupId, self.subPayerDetails.id).done(function (data, status, jqXHR) {
                self.showDeleteStage(false);
                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    transactionName: self.debtors.confirmDeleteDebtor,
                    template: "confirm-screen/payments-template"
                }, self);
                debtorModel.deleteDebtorGroup(self.subPayerDetails.groupId);
            });
        };
        self.showEditComponent = function () {
            self.stageOne(false);
            self.editStageOne(true);
        };
        self.editDebtor = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.editStageOne(false);
            self.editStageTwo(true);
        };
        self.cancelEditDebtor = function () {
            self.stageOne(true);
            self.editStageOne(false);
        };
        self.cancelStageTwo = function () {
            self.stageOne(true);
            self.editStageTwo(false);
        };
        self.cancelStageThree = function () {
            self.stageOne(true);
            self.editStageTwo(false);
            self.editStageThree(false);
        };
        self.confirmEditDebtor = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.editStageTwo(false);
            self.editStageThree(true);
        };
        self.confirmEditDebtorWithAuth = function (data, status, jqXHR) {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.editStageThree(false);
            Params.dashboard.loadComponent("confirm-screen", {
                jqXHR: jqXHR,
                hostReferenceNumber: data.externalReferenceId,
                transactionName: self.debtors.confirmEditDebtor,
                template: "confirm-screen/payments-template"
            }, self);
        };
        self.CancelEditDebtor = function () {
            history.back();
        };
    };
});