define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/payments-money-transfer",
    "framework/js/constants/constants",
    "ojs/ojknockout"
], function(oj, ko, $, internalModel, ResourceBundle, Constants) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.userSegment = Constants.userSegment;
        self.payments = ResourceBundle.payments;
        self.paymentData = self.paymentData || ko.observable();
        self.stageTwo = ko.observable(false);
        self.transferNow = ko.observable(true);
        self.frequencyDesc = ko.observable();
        self.purpose = ko.observable();
        self.purposeText = ko.observable();
        self.isStandingInstruction = ko.observable();
        self.paymentId = ko.observable();
        self.branchCode = ko.observable();
        self.confirmScreenDetailsArray = ko.observableArray();
        self.instructionId = ko.observable(ko.utils.unwrapObservable(self.params.data ? self.params.data.instructionId : self.params.transferData.instructionId));
        void(self.params.transferData && self.params.transferData.reviewMode && rootParams.dashboard.headerName(self.params.transferData.header));
        self.payeeDetails = ko.observable({});
        self.confirmScreenDetails = rootParams.rootModel.confirmScreenDetails;
        self.dealDetails = ko.observable();
        self.dealType = ko.observable();
        self.exchangeRate = ko.observable();
        if (self.instructionId()) {
            self.transferNow(false);
            self.stageTwo(true);
            self.paymentId(self.instructionId());
        } else if (ko.utils.unwrapObservable(self.params.data || self.params.transferData.paymentId)) {
            self.stageTwo(true);
            self.paymentId(ko.utils.unwrapObservable(self.params.data ? self.params.data.paymentId : self.params.transferData.paymentId));
        }

        function purposeHandler(data) {
            if (data.purposeList !== null && data.purposeList.length > 0) {
                for (var i = 0; i < data.purposeList.length; i++) {
                    if (self.purpose() === data.purposeList[i].code) {
                        self.purposeText(data.purposeList[i].description);
                        break;
                    }
                }
                self.stageTwo(true);
            }
        }
        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
        };
        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.payments.common.confirmScreen.approvalMessages.FAILED.statusmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
        };

        function responseHandler(data) {
            self.paymentData(data);
            if (self.paymentData().transferDetails && self.paymentData().transferDetails.dealId) {
                internalModel.fetchForexDealList(self.paymentData().transferDetails.dealId).then(function(data) {
                    self.dealDetails(false);
                    self.dealType(data.forexDealDTO[0].dealType === "S" ? self.payments.moneytransfer.spot : self.payments.moneytransfer.forward);
                    self.exchangeRate(rootParams.baseModel.formatCurrency(data.forexDealDTO[0].rate, data.forexDealDTO[0].rateType === "B" ? data.forexDealDTO[0].buyAmount.currency : data.forexDealDTO[0].sellAmount.currency));
                    ko.tasks.runEarly();
                    self.dealDetails(true);
                });
            } else if (self.paymentData().transferDetails.instructionDetails && self.paymentData().transferDetails.instructionDetails.dealId) {
                internalModel.fetchForexDealList(self.paymentData().transferDetails.instructionDetails.dealId).then(function(data) {
                    self.dealDetails(false);
                    self.dealType(data.forexDealDTO[0].dealType === "S" ? self.payments.moneytransfer.spot : self.payments.moneytransfer.forward);
                    self.exchangeRate(rootParams.baseModel.formatCurrency(data.forexDealDTO[0].rate, data.forexDealDTO[0].rateType === "B" ? data.forexDealDTO[0].buyAmount.currency : data.forexDealDTO[0].sellAmount.currency));
                    ko.tasks.runEarly();
                    self.dealDetails(true);
                });
            }

            if (!self.transferNow()) {
                self.isStandingInstruction(data.transferDetails.instructionDetails.type === "REC");
                self.purpose(data.transferDetails.instructionDetails.purpose);
                if (self.purpose() === "OTH")
                    self.purposeText(data.transferDetails.instructionDetails.purposeText);
                self.payeeDetails({
                    accountType: "INTERNAL",
                    accountNumber: self.paymentData().transferDetails.payeeDetails.accountNumber,
                    accountName: self.paymentData().transferDetails.payeeDetails.accountName
                });
            } else {
                self.purpose(data.transferDetails.purpose);
                if (self.purpose() === "OTH")
                    self.purposeText(data.transferDetails.purposeText);
                self.payeeDetails({
                    accountType: "INTERNAL",
                    accountNumber: self.paymentData().payeeDetails.accountNumber,
                    accountName: self.paymentData().payeeDetails.accountName
                });
            }
            if (self.purpose() !== "OTH")
                void((self.isMultiplePayment && purposeHandler(self.supportingData.purpose)) || self.getPurposeDescription());
            else
                self.stageTwo(true);
            var confirmScreenDetailsArray = [
                [{
                        label: self.payments.moneytransfer.transferTo,
                        value: data.payeeDetails ? data.payeeDetails.nickName : data.transferDetails.payeeDetails.nickName
                    },
                    {
                        label: self.payments.moneytransfer.amount,
                        value: data.transferDetails.instructionDetails ? rootParams.baseModel.formatCurrency(data.transferDetails.instructionDetails.amount.amount, data.transferDetails.instructionDetails.amount.currency) : rootParams.baseModel.formatCurrency(data.transferDetails.amount.amount, data.transferDetails.amount.currency)
                    }
                ],
                [{
                        label: self.payments ? self.payments.payee.accountNumber : self.payments.moneytransfer.accountNumber,
                        value: self.payeeDetails().accountNumber
                    },
                    {
                        label: self.payments ? self.payments.payee.accountType : self.payments.moneytransfer.accountType,
                        value: self.payments.payee.type.INTERNAL
                    }
                ],
                [{
                    label: self.payments.moneytransfer.transferfrom,
                    value: data.transferDetails.instructionDetails ? data.transferDetails.instructionDetails.debitAccountId.displayValue : data.transferDetails.debitAccountId.displayValue
                }].concat(self.isStandingInstruction() ? [{
                    label: self.payments.moneytransfer.frequency,
                    value: self.payments.common.frequency[data.transferDetails.instructionDetails.frequency]
                }] : [{
                    label: self.payments.moneytransfer.transferon,
                    value: data.transferDetails.instructionDetails ? rootParams.baseModel.formatDate(data.transferDetails.instructionDetails.startDate) : rootParams.baseModel.formatDate(data.transferDetails.valueDate)
                }])
            ].concat(self.isStandingInstruction() ? [{
                    label: self.payments.moneytransfer.startTransfer,
                    value: data.transferDetails.instructionDetails ? rootParams.baseModel.formatDate(data.transferDetails.instructionDetails.startDate) : rootParams.baseModel.formatDate(data.transferDetails.valueDate)
                },
                {
                    label: self.payments.moneytransfer.stopTransfer,
                    value: rootParams.baseModel.formatDate(data.transferDetails.instructionDetails.endDate)
                }
            ] : []).concat(data.transferDetails.instructionDetails && data.transferDetails.instructionDetails.dealId ? [
                [{
                    label: self.payments.moneytransfer.dealNumber,
                    value: data.transferDetails.instructionDetails.dealId
                }]
            ] : []).concat(data.transferDetails && data.transferDetails.dealId ? [
                [{
                    label: self.payments.moneytransfer.dealNumber,
                    value: data.transferDetails.dealId
                }]
            ] : []);
            if (self.shareMessage) {
                self.shareMessage(rootParams.baseModel.format(self.shareMessage(), {
                    amount: data.transferDetails.instructionDetails ? rootParams.baseModel.formatCurrency(data.transferDetails.instructionDetails.amount.amount, data.transferDetails.instructionDetails.amount.currency) : rootParams.baseModel.formatCurrency(data.transferDetails.amount.amount, data.transferDetails.amount.currency),
                    transferTo: data.payeeDetails ? data.payeeDetails.nickName : data.transferDetails.payeeDetails.nickName,
                    valueDate: data.transferDetails.instructionDetails ? rootParams.baseModel.formatDate(data.transferDetails.instructionDetails.startDate) : rootParams.baseModel.formatDate(data.transferDetails.valueDate)
                }));
            }
            if (typeof self.confirmScreenDetails === "function")
                self.confirmScreenDetails(confirmScreenDetailsArray);
            else if (self.confirmScreenExtensions) {
                $.extend(self.confirmScreenExtensions, {
                    isSet: true,
                    eReceiptRequired: true,
                    taskCode: "PC_F_INTRNL",
                    confirmScreenDetails: confirmScreenDetailsArray,
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    confirmScreenStatusEval: self.getConfirmScreenStatus,
                    template: "confirm-screen/payments-template"
                });
            }
        }
        self.getFrequencyDescription = function() {
            internalModel.getFrequencyDesc().done(function(data) {
                if (data.enumRepresentations !== null) {
                    for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        if (self.paymentData().transferDetails.instructionDetails.frequency === data.enumRepresentations[0].data[i].code) {
                            self.frequencyDesc(data.enumRepresentations[0].data[i].description);
                            self.isStandingInstruction(true);
                            break;
                        }
                    }
                }
            });
        };
        self.getPurposeDescription = function() {
            internalModel.getPurposeDesc().done(function(data) {
                purposeHandler(data);
            });
        };
        if (self.isMultiplePayment) {
            self.transferNow(rootParams.isTransferNow);
            responseHandler(self.params.data);
        } else {
            internalModel.getTransferData(self.paymentId(), "transfers", "internal", self.transferNow()).done(function(data) {
                responseHandler(data);
            });
        }
    };
});