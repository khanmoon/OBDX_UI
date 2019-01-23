define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/review-scheduled-payments",
    "ojs/ojinputnumber"
], function (oj, ko, $, reviewScheduledPaymentsInfoModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.paymentDetails = ko.observable({});
        self.dataLoaded = ko.observable(false);
        self.confirmScreenDetails = rootParams.rootModel.confirmScreenDetails;
        rootParams.dashboard.headerName(self.params.header);
        self.confirmScreenExtensions = rootParams.rootModel.confirmScreenExtensions;
        reviewScheduledPaymentsInfoModel.init();
        function getPurposeDescription(purpose) {
            reviewScheduledPaymentsInfoModel.getPurposeDesc().done(function (data) {
                if (data.purposeList !== null && data.purposeList.length > 0) {
                    for (var i = 0; i < data.purposeList.length; i++) {
                        if (purpose === data.purposeList[i].code) {
                            self.paymentDetails().purpose = data.purposeList[i].description;
                            self.dataLoaded(true);
                        }
                    }
                }
            });
        }
        self.getConfirmScreenMsg = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec"){
                var errors = jqXHR.responseJSON.transactionAction.transactionDTO.errors;
                return errors && errors[0] && errors[0].errorMessage?errors[0].errorMessage:self.resource.common.confirmScreen.approvalMessages.FAILED.successmsg;
            }else if (jqXHR.responseJSON.transactionAction)
                return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
        };
        self.getConfirmScreenStatus = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.resource.common.confirmScreen.approvalMessages.FAILED.statusmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
        };
        reviewScheduledPaymentsInfoModel.readCancelSI(self.params.data.externalReferenceId()).done(function (data) {
            self.paymentDetails({
                payeeName: data.instructionsList[0].payeeNickName,
                accountType: self.resource.reviewUpcomingPayments.type[data.instructionsList[0].paymentType],
                accountNumber: data.instructionsList[0].creditAccountId.displayValue,
                accountName: "",
                branch: data.instructionsList[0].branchCode,
                fromAccount: data.instructionsList[0].debitAccountId.displayValue,
                amount: rootParams.baseModel.formatCurrency(data.instructionsList[0].amount.amount, data.instructionsList[0].amount.currency),
                frequency: self.getRepeatData(data),
                startDate: rootParams.baseModel.formatDate(data.instructionsList[0].startDate),
                endDate: rootParams.baseModel.formatDate(data.instructionsList[0].endDate),
                type: data.instructionsList[0].type,
                dealId: data.instructionsList[0].dealId,
                remarks: data.instructionsList[0].remarks,
                isDraft: data.instructionsList[0].paymentType ? data.instructionsList[0].paymentType.indexOf("DRAFT") > -1 : "",
                transactionType: data.instructionsList[0].paymentType
            });
            if (data.instructionsList[0].purpose && data.instructionsList[0].purpose !== "OTH")
                getPurposeDescription(data.instructionsList[0].purpose);
            else {
                self.paymentDetails().purpose = data.instructionsList[0].purposeText;
                self.dataLoaded(true);
            }
            var confirmScreenDetailsArray = [
                [
                    {
                        label: self.paymentDetails().isDraft ? self.resource.reviewUpcomingPayments.favouring : self.resource.reviewUpcomingPayments.beneficiaryName,
                        value: self.paymentDetails().payeeName
                    },
                    {
                        label: self.paymentDetails().isDraft ? self.resource.reviewUpcomingPayments.draftType : self.resource.reviewUpcomingPayments.accountType,
                        value: self.paymentDetails().accountType
                    }
                ],
                [
                    {
                        label: self.resource.reviewUpcomingPayments.amount,
                        value: self.paymentDetails().amount
                    },
                    {
                        label: self.resource.reviewUpcomingPayments.fromAccount,
                        value: self.paymentDetails().fromAccount
                    }
                ],
                [{
                        label: self.paymentDetails().type === "NONREC" ? self.resource.reviewUpcomingPayments.transferon : self.resource.reviewUpcomingPayments.endDate,
                        value: self.paymentDetails().endDate
                    }].concat(!self.paymentDetails().isDraft ? [{
                        label: self.resource.reviewUpcomingPayments.accountNumber,
                        value: self.paymentDetails().accountNumber
                    }] : [])
            ].concat(self.paymentDetails().type === "REC" ? [[
                    {
                        label: self.resource.reviewUpcomingPayments.transFreq,
                        value: self.paymentDetails().frequency
                    },
                    {
                        label: self.resource.reviewUpcomingPayments.startDate,
                        value: self.paymentDetails().startDate
                    }
                ]] : []);
            if (typeof self.confirmScreenDetails === "function")
                self.confirmScreenDetails(confirmScreenDetailsArray);
            else if (self.confirmScreenExtensions) {
                $.extend(self.confirmScreenExtensions, {
                    isSet: true,
                    eReceiptRequired: true,
                    taskCode: "PC_F_PIC",
                    confirmScreenDetails: confirmScreenDetailsArray,
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    confirmScreenStatusEval: self.getConfirmScreenStatus,
                    template: "confirm-screen/payments-template"
                });
            }
        });
        self.getRepeatData = function (data) {
            if (data.instructionsList[0].type === "REC") {
                if (data.instructionsList[0].freqYears > 1) {
                    return rootParams.baseModel.format(self.resource.reviewUpcomingPayments.repeatmsgyears, { n: data.instructionsList[0].freqYears });
                } else if (data.instructionsList[0].freqMonths > 1) {
                    return rootParams.baseModel.format(self.resource.reviewUpcomingPayments.repeatmsgmonths, { n: data.instructionsList[0].freqMonths });
                } else if (data.instructionsList[0].freqDays > 1) {
                    return rootParams.baseModel.format(self.resource.reviewUpcomingPayments.repeatmsgdays, { n: data.instructionsList[0].freqDays });
                } else if (data.instructionsList[0].freqYears === 1) {
                    return rootParams.baseModel.format(self.resource.reviewUpcomingPayments.repeatmsgyear);
                } else if (data.instructionsList[0].freqMonths === 1) {
                    return rootParams.baseModel.format(self.resource.reviewUpcomingPayments.repeatmsgmonth);
                } else if (data.instructionsList[0].freqDays === 1) {
                    return rootParams.baseModel.format(self.resource.reviewUpcomingPayments.repeatmsgday);
                }
            } else {
                return "";
            }
        };
    };
});