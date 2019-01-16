define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/review-biller-details-edit",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton"
], function (oj, ko, $, editBillerModel, BaseLogger, ResourceBundle, Constants) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.common = ResourceBundle.common;
        self.payments = ResourceBundle;
        self.resource = ResourceBundle.biller;
        self.billerDescription = ko.observable();
        self.detailsLoaded = ko.observable(false);
        self.billerDetails = ko.observable({});
        self.confirmScreenDetails = Params.rootModel.confirmScreenDetails;
        self.confirmScreenExtensions = Params.rootModel.confirmScreenExtensions;
        var billerDetails = self.params.data ? self.params.data.billerDetails : self.params.billerDetails;
        self.billerDetails({
            relationshipNumber: billerDetails.relationshipNumber(),
            consumerNumber: billerDetails.consumerNumber ? billerDetails.consumerNumber() : "",
            accountRelationshipNumber: billerDetails.accountRelationshipNumber ? billerDetails.accountRelationshipNumber() : ""
        });
        self.getConfirmScreenMsg = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
        };
        self.getConfirmScreenStatus = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.payments.common.confirmScreen.approvalMessages.FAILED.statusmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
        };
        editBillerModel.getBillerDescription(billerDetails.billerId()).done(function (data) {
            self.billerDetails().categoryType = data.billerCategoryRel.categoryType;
            self.billerDetails().billerDescription = data.billerCategoryRel.billerDescription;
            self.detailsLoaded(true);
            var confirmScreenDetailsArray = [
                [
                    {
                        label: self.resource.category,
                        value: self.billerDetails().categoryType
                    },
                    {
                        label: self.resource.billerName,
                        value: self.billerDetails().billerDescription
                    }
                ],
                [{
                        label: self.resource.relationship1,
                        value: self.billerDetails().relationshipNumber
                    }]
            ];
            if (typeof self.confirmScreenDetails === "function")
                self.confirmScreenDetails(confirmScreenDetailsArray);
            else if (self.confirmScreenExtensions) {
                $.extend(self.confirmScreenExtensions, {
                    isSet: true,
                    confirmScreenDetails: confirmScreenDetailsArray,
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    confirmScreenStatusEval: self.getConfirmScreenStatus,
                    template: "confirm-screen/payments-template"
                });
            }
        });
    };
});