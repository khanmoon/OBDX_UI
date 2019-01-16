define([
    "knockout",
    "jquery",
    "./model",

    "framework/js/constants/constants",
    "ojL10n!resources/nls/cheque-stop-unblock",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojswitch",
    "ojs/ojradioset",
    "ojs/ojinputtext",
    "ojs/ojvalidationgroup"
], function (ko, $, StopUnblockChequeModel, Constants, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.constants = Constants;
        self.chequeNo = ko.observable();
        self.chequeStopUnblockLocale = locale;
        self.chequeInstructionType = ko.observable("STOP");
        self.actionSelected = ko.observable("Stop");
        self.validationTracker = ko.observable();
        self.accountNumber = ko.observable();
        self.additionalDetails = ko.observable();
        self.selectedAccount = ko.observable();
        self.defaultOption = ko.observable("Number");
        ko.utils.extend(self, rootParams.rootModel);
        var confirmScreenExtensions = {};
        if (self.params.id) {
            self.accountNumber(self.params.id.value);
            self.additionalDetails({ account: { id: self.params.id } });
        }
        rootParams.dashboard.headerName(locale.compName.compName);
        rootParams.baseModel.registerElement("account-input");
        var getNewKoModel = function () {
            return ko.mapping.fromJS(StopUnblockChequeModel.getNewModel());
        };
        self.stopUnblockChequeModelInstance = self.stopUnblockChequeModelInstance || getNewKoModel();
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerComponent("cheque-details", "demand-deposits");
        rootParams.baseModel.registerComponent("review-cheque-stop-unblock", "demand-deposits");
        self.review = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("unblockCheque"))) {
                return;
            }
            self.stopUnblockChequeModelInstance.stopUnblockCheque.startChequeNumber(self.stopUnblockChequeModelInstance.chequeNo.startChequeNumber());
            self.stopUnblockChequeModelInstance.stopUnblockCheque.endChequeNumber(self.stopUnblockChequeModelInstance.chequeNo.endChequeNumber());
            self.stopUnblockChequeModelInstance.stopUnblockCheque.chequeInstructionType(self.chequeInstructionType());
            rootParams.dashboard.loadComponent("review-cheque-stop-unblock", {
                mode: "review",
                data: self.stopUnblockChequeModelInstance.stopUnblockCheque,
                confirmScreenExtensions: confirmScreenExtensions
            }, self);
        };
        self.submit = function () {
            StopUnblockChequeModel.postRequest(self.accountNumber(), ko.mapping.toJSON(self.stopUnblockChequeModelInstance.stopUnblockCheque)).done(function (data, status, jqXhr) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: locale.compName.compName,
                    eReceiptRequired: true,
                    hostReferenceNumber: data.revokeStopChequeInstructionDTO.chequeBookRequestRefNo,
                    confirmScreenExtensions: confirmScreenExtensions,
                    template: "confirm-screen/casa-template"
                }, self);
            });
        };
        self.switchAction = function (event) {
            if (event.detail.value === "Stop") {
                self.actionSelected("Stop");
                self.chequeInstructionType("STOP");
            } else {
                self.actionSelected("Unblock");
                self.chequeInstructionType("REVOKE");
            }
        };
    };
});
