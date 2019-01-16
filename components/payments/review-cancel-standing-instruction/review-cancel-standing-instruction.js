define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/review-cancel-standing-instruction",
    "framework/js/constants/constants",
    "ojs/ojknockout"
], function (oj, ko, $, cancelInstructionModel, ResourceBundle, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.userSegment = Constants.userSegment;
        self.resource = ResourceBundle;
        self.confirmScreenDetails = rootParams.rootModel.confirmScreenDetails;
        self.confirmScreenExtensions = rootParams.rootModel.confirmScreenExtensions;
        self.instructionDetails = ko.observableArray();
        self.stageTwo = ko.observable(false);
        self.getConfirmScreenMsg = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.resource.common.confirmScreen.approvalMessages.FAILED.successmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
        };
        self.getConfirmScreenStatus = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.resource.common.confirmScreen.approvalMessages.FAILED.statusmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
        };
        cancelInstructionModel.readInstructionDetails(self.params.data ? self.params.data.externalReferenceId() : self.params.externalReferenceId()).done(function (data) {
            if (data.instructionsList.length > 0) {
                self.instructionDetails.push({
                    date: data.instructionsList[0].nextExecutionDate,
                    amount: data.instructionsList[0].amount.amount,
                    currency: data.instructionsList[0].amount.currency,
                    creditAccount: data.instructionsList[0].creditAccountId.displayValue,
                    account: data.instructionsList[0].debitAccountId.displayValue,
                    description: self.paymentDetails.msgtype[data.instructionsList[0].paymentType],
                    externalReferenceNumber: data.instructionsList[0].externalReferenceNumber,
                    name: "payeeNickName" in data.instructionsList[0] ? data.instructionsList[0].payeeNickName : "-",
                    type: data.instructionsList[0].type,
                    freqYears: data.instructionsList[0].freqYears,
                    freqDays: data.instructionsList[0].freqDays,
                    freqMonths: data.instructionsList[0].freqMonths,
                    nextExecutionDate: data.instructionsList[0].nextExecutionDate,
                    instances: data.instructionsList[0].instances,
                    paymentType: data.instructionsList[0].paymentType,
                    startDate: data.instructionsList[0].startDate,
                    endDate: data.instructionsList[0].endDate
                });
            }
            self.stageTwo(true);
            var confirmScreenDetailsArray = [
                [
                    {
                        label: self.resource.paymentDetails.transferTo,
                        value: self.instructionDetails()[0].name
                    },
                    {
                        label: self.resource.paymentDetails.amount,
                        value: rootParams.baseModel.formatCurrency(self.instructionDetails()[0].amount, self.instructionDetails()[0].currency)
                    }
                ],
                [
                    {
                        label: self.resource.paymentDetails.startTransfer,
                        value: rootParams.baseModel.formatDate(self.instructionDetails()[0].startDate)
                    },
                    {
                        label: self.resource.paymentDetails.stopTransfer,
                        value: rootParams.baseModel.formatDate(self.instructionDetails()[0].endDate)
                    }
                ],
                [{
                        label: self.resource.paymentDetails.transferFrom,
                        value: self.instructionDetails()[0].account
                    }]
            ];
            if (typeof self.confirmScreenDetails === "function")
                self.confirmScreenDetails(confirmScreenDetailsArray);
            else if (self.confirmScreenExtensions) {
                $.extend(self.confirmScreenExtensions, {
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    confirmScreenStatusEval: self.getConfirmScreenStatus,
                    isSet: true,
                    eReceiptRequired: true,
                    taskCode: "PC_F_PIC",
                    confirmScreenDetails: confirmScreenDetailsArray,
                    template: "confirm-screen/payments-template"
                });
            }
        });
    };
});