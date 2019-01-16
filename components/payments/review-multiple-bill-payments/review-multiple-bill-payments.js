define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/review-multiple-bill-payments",
    "./model",
    "ojs/ojknockout",
    "ojs/ojbutton",
    "ojs/ojarraytabledatasource",
    "ojs/ojaccordion"
], function (oj, ko, $, ResourceBundle, Model) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle;
        self.payments = ResourceBundle.payments;
        self.masterBatchArray = self.params.masterBatchArray;
        self.dataloaded = ko.observable(false);
        self.reviewMode = true;
        Params.baseModel.registerComponent("review-bill-payments", "payments");
        Params.baseModel.registerElement("confirm-screen");
        Params.baseModel.registerComponent("multiple-bill-payments-status", "payments");
        self.supportingData = {};
        self.multiplePaymentsStatusDatasource = ko.observable();
        self.isInitAuth = ko.observable(false);
        self.expandedAccordians = ko.observableArray();
        Params.dashboard.headerName(self.resource.label.header);
        function buildBatchRequest(methodType) {
            var batchRequest = { batchDetailRequestList: [] };
            for (var i = 0; i < self.masterBatchArray.length; i++) {
                if (self.masterBatchArray[i].isSuccess) {
                    self.masterBatchArray[i].uri.params.paymentId = self.masterBatchArray[i].response.paymentId;
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
        $.when(Model.fireBatch(buildBatchRequest("GET"))).then(function (batchData) {
            for (var i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
                var obj = ko.utils.arrayFirst(self.masterBatchArray, function (element) {
                    return element.id === Number(batchData.batchDetailResponseDTOList[i].sequenceId);
                });
                obj.isSuccess = batchData.batchDetailResponseDTOList[i].status === 200;
                obj.response = batchData.batchDetailResponseDTOList[i].responseObj;
                obj.reviewComponent = "review-bill-payments";
            }
            self.dataloaded(true);
        });
        self.expandAllAccordians = function () {
            ko.utils.arrayForEach(self.masterBatchArray, function (item) {
                self.expandedAccordians.push({ id: "batch-payment-" + item.id });
            });
        };
        self.collapseAllAccordians = function () {
            while (self.expandedAccordians().length > 0) {
                self.expandedAccordians.pop();
            }
        };
        self.viewPaymentStatus = function () {
            Params.dashboard.loadComponent("multiple-bill-payments-status", { statusData: self.masterBatchArray }, self);
        };
        self.confirmPayment = function () {
            Model.fireBatch(buildBatchRequest("PATCH"), "MBP").done(function (data, status, jqXHR) {
                var atleastOneFail, confirmMessage, statusMessage,failedTxnSeqId;
                for (var i = 0; i < data.batchDetailResponseDTOList.length; i++) {
                    var obj = ko.utils.arrayFirst(self.masterBatchArray, function (element) {
                        return element.id === Number(data.batchDetailResponseDTOList[i].sequenceId);
                    });
                    obj.isSuccess = data.batchDetailResponseDTOList[i].status === 200 || data.batchDetailResponseDTOList[i].status === 202;
                    obj.response = data.batchDetailResponseDTOList[i].responseObj;
                    obj.status = data.batchDetailResponseDTOList[i].status;
                    if (!obj.isSuccess){
                        failedTxnSeqId = obj.id;
                        atleastOneFail = true;
                    }
                    if (obj.status === 202 && !self.isInitAuth())
                        self.isInitAuth(true);
                }
                if (atleastOneFail) {
                    confirmMessage = self.resource.message.failureMessage;
                    statusMessage = self.resource.list.status.error;
                } else {
                    confirmMessage = self.resource.message.successMessage;
                    statusMessage = self.resource.list.status.success;
                }
                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    eReceiptRequired: false,
                    isMultipleBillPayment: true,
                    transactionName: self.resource.label.title,
                    confirmScreenExtensions: {
                        confirmScreenMsgEval: function(data) {
                            if (failedTxnSeqId && Number(data.sequenceId) === failedTxnSeqId) {
                                return confirmMessage;
                            } else if (!failedTxnSeqId) {
                                return data.sequenceId === "1" ? confirmMessage : null;
                            }
                        },
                        statusMessages: statusMessage,
                        isSet: true,
                        template: "confirm-screen/payments-template"
                    }
                }, self);
            });
        };
    };
});