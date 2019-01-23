define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/review-payment-self",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojbutton"
], function(oj, ko, $, selfModel, ResourceBundle, Constants) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.userSegment = Constants.userSegment;
        self.resource = ResourceBundle;
        self.paymentData = self.paymentData || ko.observable();
        self.isDataLoaded = ko.observable(false);
        self.isStandingInstruction = ko.observable(false);
        self.isInstr = ko.observable(false);
        self.paymentId = ko.observable();
        self.confirmScreenDetails = rootParams.rootModel.confirmScreenDetails;
        self.dealDetails = ko.observable();
        self.dealType = ko.observable();
        self.exchangeRate = ko.observable();
        void(self.params.transferData && self.params.transferData.reviewMode && rootParams.dashboard.headerName(self.params.transferData.header));
        if (self.params.transferData && self.params.transferData.instructionId) {
            self.paymentId(ko.utils.unwrapObservable(self.params.transferData.instructionId));
            self.isInstr(true);
        } else if (self.params.transferData && self.params.transferData.paymentId) {
            self.paymentId(ko.utils.unwrapObservable(self.params.transferData.paymentId));
        } else if (self.params.data) {
            self.paymentId(ko.utils.unwrapObservable(self.params.data.paymentId || self.params.data.instructionId));
            self.isInstr(!!self.params.data.instructionId);
        }
        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec"){
                var errors = jqXHR.responseJSON.transactionAction.transactionDTO.errors;
                return errors && errors[0] && errors[0].errorMessage?errors[0].errorMessage:self.resource.common.confirmScreen.approvalMessages.FAILED.successmsg;
            }else if (jqXHR.responseJSON.transactionAction)
                return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
        };
        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.resource.common.confirmScreen.approvalMessages.FAILED.statusmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
        };
        selfModel.getTransferData(self.paymentId(), self.isInstr()).done(function(data) {
            self.paymentData(data);
            self.isDataLoaded(true);
            if (self.paymentData().transferDetails && self.paymentData().transferDetails.dealId) {
                selfModel.fetchForexDealList(self.paymentData().transferDetails.dealId).then(function(data) {
                    self.dealDetails(false);
                    self.exchangeRate(rootParams.baseModel.formatCurrency(data.forexDealDTO[0].rate, data.forexDealDTO[0].rateType === "B" ? data.forexDealDTO[0].buyAmount.currency : data.forexDealDTO[0].sellAmount.currency));
                    self.dealType(data.forexDealDTO[0].dealType === "S" ? self.resource.paymentDetails.spot : self.resource.paymentDetails.forward);
                    ko.tasks.runEarly();
                    self.dealDetails(true);
                });
            } else if (self.paymentData().transferDetails.instructionDetails && self.paymentData().transferDetails.instructionDetails.dealId) {
                selfModel.fetchForexDealList(self.paymentData().transferDetails.instructionDetails.dealId).then(function(data) {
                    self.dealDetails(false);
                    self.dealType(data.forexDealDTO[0].dealType === "S" ? self.payments.moneytransfer.spot : self.payments.moneytransfer.forward);
                    self.exchangeRate(rootParams.baseModel.formatCurrency(data.forexDealDTO[0].rate, data.forexDealDTO[0].rateType === "B" ? data.forexDealDTO[0].buyAmount.currency : data.forexDealDTO[0].sellAmount.currency));
                    ko.tasks.runEarly();
                    self.dealDetails(true);
                });
            }
            self.isStandingInstruction(data.transferDetails.type === "REC");
            var confirmScreenDetailsArray = [
                [{
                        label: self.resource.paymentDetails.transferto,
                        value: data.transferDetails.creditAccountId.displayValue
                    },
                    {
                        label: self.resource.paymentDetails.amount,
                        value: rootParams.baseModel.formatCurrency(data.transferDetails.amount.amount, data.transferDetails.amount.currency)
                    }
                ],
                [{
                    label: self.resource.paymentDetails.transferfrom,
                    value: data.transferDetails.debitAccountId.displayValue
                }].concat(self.isStandingInstruction() ? [{
                    label: self.resource.paymentDetails.frequency,
                    value: self.resource.frequency[data.transferDetails.frequency]
                }] : [{
                    label: self.resource.paymentDetails.transferon,
                    value: data.transferDetails.startDate ? rootParams.baseModel.formatDate(data.transferDetails.startDate) : rootParams.baseModel.formatDate(data.transferDetails.valueDate)
                }])
            ].concat(self.isStandingInstruction() ? [
                [{
                        label: self.resource.paymentDetails.startTransfer,
                        value: data.transferDetails.startDate ? rootParams.baseModel.formatDate(data.transferDetails.startDate) : rootParams.baseModel.formatDate(data.transferDetails.valueDate)
                    },
                    {
                        label: self.resource.paymentDetails.stopTransfer,
                        value: rootParams.baseModel.formatDate(data.transferDetails.endDate)
                    }
                ]
            ] : []).concat(data.transferDetails && data.transferDetails.dealId ? [
                [{
                    label: self.payments.moneytransfer.dealNumber,
                    value: data.transferDetails.dealId
                }]
            ] : []).concat(data.transferDetails.instructionDetails && data.transferDetails.instructionDetails.dealId ? [
                [{
                    label: self.payments.moneytransfer.dealNumber,
                    value: data.transferDetails.instructionDetails.dealId
                }]
            ] : []);
            if (self.shareMessage) {
                self.shareMessage(rootParams.baseModel.format(self.shareMessage(), {
                    amount: rootParams.baseModel.formatCurrency(data.transferDetails.amount.amount, data.transferDetails.amount.currency),
                    transferTo: data.transferDetails.creditAccountId.displayValue,
                    valueDate: data.transferDetails.startDate ? rootParams.baseModel.formatDate(data.transferDetails.startDate) : rootParams.baseModel.formatDate(data.transferDetails.valueDate)
                }));
            }
            if (typeof self.confirmScreenDetails === "function")
                self.confirmScreenDetails(confirmScreenDetailsArray);
            else if (self.confirmScreenExtensions) {
                $.extend(self.confirmScreenExtensions, {
                    isSet: true,
                    eReceiptRequired: true,
                    taskCode: "PC_F_SELF",
                    confirmScreenDetails: confirmScreenDetailsArray,
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    confirmScreenStatusEval: self.getConfirmScreenStatus,
                    template: "confirm-screen/payments-template"
                });
            }
        });
        self.getRepeateIntervals = function() {
            selfModel.getRepeateIntervals().done(function(data) {
                if (data.enumRepresentations !== null) {
                    for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        if (self.paymentData().transferDetails.frequency === data.enumRepresentations[0].data[i].code) {
                            self.paymentData().transferDetails.frequencyDescription = data.enumRepresentations[0].data[i].description;
                            self.isStandingInstruction(true);
                            break;
                        }
                    }
                }
                self.isDataLoaded(true);
            });
        };
    };
});