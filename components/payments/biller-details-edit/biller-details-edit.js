define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!resources/nls/biller-details-edit",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojknockout-validation"
], function (oj, ko, $, editBillerModel, BaseLogger, ResourceBundle, Constants) {
    "use strict";
    return function (Params) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(editBillerModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, Params.rootModel);
        var baseModel = Params.baseModel;
        self.closeModal = Params.closeModal;
        self.userSegment = Constants.userSegment;
        self.resource = ResourceBundle;
        self.billers = ResourceBundle.billers;
        self.editedBiller = getNewKoModel().newEditedBillerModel;
        self.editBillerData = ko.mapping.toJS(Params.billerDetails || self.params.billerDetails || self.params);
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.validationTracker = ko.observable();
        self.confirmScreenDetails = ko.observable();
        baseModel.registerComponent("biller-details-edit", "payments");
        if (self.userSegment === "CORP" || (self.userSegment === "RETAIL" && baseModel.small()))
            Params.dashboard.headerName(self.billers.title);
        editBillerModel.init(self.editBillerData.billerId, self.editBillerData.relationshipNumber);
        baseModel.registerElement("confirm-screen");
        self.editBiller = function () {
            if (!baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.editedBiller.relationshipNumber(self.editBillerData.relationshipNumber);
            self.editedBiller.consumerNumber(self.editBillerData.consumerNumber);
            self.editedBiller.accountRelationshipNumber(self.editBillerData.accountRelationshipNumber);
            if (self.userSegment === "CORP") {
                self.stageOne(false);
                self.stageTwo(true);
            } else {
                self.confirmBiller();
            }
            var confirmScreenDetailsArray = [
                [
                    {
                        label: self.billers.category,
                        value: self.editBillerData.categoryType
                    },
                    {
                        label: self.billers.billerName,
                        value: self.editBillerData.billerName
                    }
                ],
                [{
                        label: self.billers.relationship1,
                        value: self.editBillerData.relationshipNumber
                    }]
            ];
            self.confirmScreenDetails(confirmScreenDetailsArray);
        };
        self.cancelBillerConfirmation = function () {
            self.stageOne(true);
            self.stageTwo(false);
        };
        self.done = function () {
            self.stageOne(true);
            self.stageTwo(false);
        };
        self.cancelBillerEdit = function () {
            if (self.userSegment === "CORP" || (self.userSegment === "RETAIL" && baseModel.small()))
                Params.dashboard.hideDetails();
            else
                self.isEdit(false);
        };
        self.confirmBiller = function () {
            if (!baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            var billerPayload = ko.toJSON(self.editedBiller);
            editBillerModel.editBiller(billerPayload).done(function (data, status, jqXHR) {
                if (self.userSegment === "CORP" || (self.userSegment === "RETAIL" && baseModel.small())) {
                    self.stageOne(false);
                    self.stageTwo(false);
                    self.httpStatus = jqXHR.status;
                    var successMessage, statusMessages;
                    if (self.httpStatus && self.httpStatus !== 202) {
                        successMessage = self.billers.successMessage;
                        statusMessages = self.billers.sucessfull;
                    }
                    if (self.httpStatus && self.httpStatus === 200) {
                        successMessage = self.billers.editsuccess;
                        statusMessages = self.billers.sucessfull;
                    } else {
                        successMessage = self.billers.corpMaker;
                        statusMessages = self.billers.pendingApproval;
                    }
                    Params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        transactionName: self.billers.confirmBiller,
                        confirmScreenExtensions: {
                            successMessage: successMessage,
                            statusMessages: statusMessages,
                            isSet: true,
                            confirmScreenDetails: self.confirmScreenDetails(),
                            template: "confirm-screen/payments-template"
                        }
                    }, self);
                } else {
                    self.closeModal(true, "edit");
                }
            });
        };
    };
});