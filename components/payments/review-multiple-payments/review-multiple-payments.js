define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/review-multiple-payments",
    "./model",
    "ojs/ojknockout",
    "ojs/ojbutton",
    "ojs/ojaccordion"
], function(oj, ko, $, ResourceBundle, Model) {
    "use strict";
    return function(Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle;
        self.payments = ResourceBundle.payments;
        self.masterBatchArray = self.params.masterBatchArray;
        self.dataloaded = ko.observable(false);
        self.reviewMode = true;
        Params.baseModel.registerComponent("review-payment-internal", "payments");
        Params.baseModel.registerComponent("review-payment-international", "payments");
        Params.baseModel.registerComponent("review-payment-domestic", "payments");
        Params.baseModel.registerElement("confirm-screen");
        Params.baseModel.registerComponent("multiple-payments-status", "payments");
        self.supportingData = {};
        self.isInitAuth = ko.observable(false);
        self.expandedAccordians = ko.observableArray([]);
        Params.dashboard.headerName(self.resource.label.header);

        function buildBatchRequest(methodType) {
            var batchRequest = { batchDetailRequestList: [] };
            for (var i = 0; i < self.masterBatchArray.length; i++) {
                if (self.masterBatchArray[i].isSuccess) {
                    self.masterBatchArray[i].uri.params.paymentId = self.masterBatchArray[i].response.paymentId || self.masterBatchArray[i].response.instructionId;
                    var uri = {
                        value: self.masterBatchArray[i].uri.value + "/{paymentId}",
                        params: self.masterBatchArray[i].uri.params
                    };
                    batchRequest.batchDetailRequestList.push({
                        methodType: methodType,
                        uri: uri,
                        headers: {
                            "Content-Id": self.masterBatchArray[i].id,
                            "Content-Type": "application/json"
                        }
                    });
                }
            }
            return batchRequest;
        }
        $.when(Model.fireBatch(buildBatchRequest("GET")), Model.getPurposeDesc()).then(function(batchData, purposeData) {
            self.supportingData.purpose = purposeData;
            for (var i = 0; i < batchData[0].batchDetailResponseDTOList.length; i++) {
                var obj = ko.utils.arrayFirst(self.masterBatchArray, function(element) {
                    return element.id === Number(batchData[0].batchDetailResponseDTOList[i].sequenceId);
                });
                obj.isSuccess = batchData[0].batchDetailResponseDTOList[i].status === 200;
                obj.response = batchData[0].batchDetailResponseDTOList[i].responseObj;
                if (obj.response.payoutDetails) {
                    if (obj.response.payoutDetails.instructionDetails)
                        self.masterBatchArray[i].autoPopulationData.overviewDetails().valueDate = Params.baseModel.formatDate(obj.response.payoutDetails.instructionDetails.startDate);
                    else
                        self.masterBatchArray[i].autoPopulationData.overviewDetails().valueDate = Params.baseModel.formatDate(obj.response.payoutDetails.valueDate);
                } else if (obj.response.transferDetails) {
                    if (obj.response.transferDetails.instructionDetails)
                        self.masterBatchArray[i].autoPopulationData.overviewDetails().valueDate = Params.baseModel.formatDate(obj.response.transferDetails.instructionDetails.startDate);
                    else
                        self.masterBatchArray[i].autoPopulationData.overviewDetails().valueDate = Params.baseModel.formatDate(obj.response.transferDetails.valueDate);
                }
                obj.reviewComponent = [
                    "payment-sepa",
                    "payment-uk"
                ].indexOf(obj.autoPopulationData.customTransferComponent()) > -1 ? "review-payment-domestic" : "review-" + obj.autoPopulationData.customTransferComponent();
            }
            self.dataloaded(true);
        });
        self.beforeExpandAccordian = function(item) {
            self.expandedAccordians.push({ id: item.target.id });
        };
        self.expandAllAccordians = function() {
            ko.utils.arrayForEach(self.masterBatchArray, function(item) {
                self.expandedAccordians.push({ id: "batch-payment-" + item.id });
            });
        };
        self.collapseAllAccordians = function() {
            while (self.expandedAccordians().length > 0) {
                self.expandedAccordians.pop();
            }
        };

        self.collapseAccordian = function(item) {
            for (var e = 0; e < self.expandedAccordians().length; e++) {
                if (item.target.id === self.expandedAccordians()[e].id)
                    self.expandedAccordians.splice(e, 1);
            }
        };

        self.viewPaymentStatus = function() {
            Params.dashboard.loadComponent("multiple-payments-status", { statusData: self.masterBatchArray }, self);
        };
        self.confirmPayment = function() {
            Model.fireBatch(buildBatchRequest("PATCH"), "MFT").done(function(data, status, jqXHR) {
                var confirmMessage, failedTxnSeqId;
                for (var i = 0; i < data.batchDetailResponseDTOList.length; i++) {
                    var obj = ko.utils.arrayFirst(self.masterBatchArray, function(element) {
                        return element.id === Number(data.batchDetailResponseDTOList[i].sequenceId);
                    });
                    obj.isSuccess = data.batchDetailResponseDTOList[i].status === 200 || data.batchDetailResponseDTOList[i].status === 202;
                    obj.response = data.batchDetailResponseDTOList[i].responseObj;
                    obj.status = data.batchDetailResponseDTOList[i].status;
                    if (!obj.isSuccess) {
                        failedTxnSeqId = obj.id;
                        obj.failureReason = (obj.response.status ? obj.response.status.message.detail : null) || (obj.response.message && obj.response.message.validationError ? obj.response.message.validationError[0].errorMessage : obj.response.message ? obj.response.message.title || obj.response.message.detail : obj.response.status.result);
                    }
                    if (obj.status === 202 && !self.isInitAuth())
                        self.isInitAuth(true);
                }
                if (failedTxnSeqId) {
                    confirmMessage = self.resource.message.failureMessage;
                } else {
                    confirmMessage = self.resource.message.successMessage;
                }
                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    eReceiptRequired: false,
                    isMultiplePayment: true,
                    transactionName: self.resource.label.title,
                    confirmScreenExtensions: {
                        confirmScreenMsgEval: function(data) {
                            if (failedTxnSeqId && Number(data.sequenceId) === failedTxnSeqId) {
                                return confirmMessage;
                            } else if (!failedTxnSeqId) {
                                return data.sequenceId === "1" ? confirmMessage : null;
                            }
                        },
                        isSet: true,
                        template: "confirm-screen/payments-template"
                    }
                }, self);
            });
        };
    };
});