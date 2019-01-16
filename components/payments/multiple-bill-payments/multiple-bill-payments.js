define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/multiple-bill-payments",
    "./model",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojbutton"
], function (oj, ko, $, ResourceBundle, MultipleBillPaymentsModel, Constants) {
    "use strict";
    return function (Params) {
        var self = this, maxPaymentsCount, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(MultipleBillPaymentsModel.getNewModel());
                return KoModel.autoPopulationData;
            }, getMasterArrayElement = function (autoPopulationData) {
                return {
                    id: self.id++,
                    autoPopulationData: autoPopulationData,
                    validationTracker: ko.observable(),
                    payload: null,
                    uri: {
                        value: null,
                        params: null
                    }
                };
            }, batchRequest = { batchDetailRequestList: [] };
        self.id = 1;
        self.refreshLabel = ko.observable(true);
        self.masterBatchArray = ko.observableArray();
        self.supportingData = {};
        ko.utils.extend(self, Params.rootModel.previousState ? Params.rootModel.previousState.retainedData : Params.rootModel);
        Params.baseModel.registerComponent("bill-payments", "payments");
        Params.baseModel.registerComponent("review-multiple-bill-payments", "payments");
        self.resource = ResourceBundle;
        self.isMultipleBillPayment = true;
        self.supportingDataLoaded = ko.observable(false);
        Params.dashboard.headerName(self.resource.title.header);
        if (self.masterBatchArray().length === 0)
            self.masterBatchArray.push(getMasterArrayElement(getNewKoModel()), getMasterArrayElement(getNewKoModel()));
        if (Object.getOwnPropertyNames(self.supportingData).length === 0) {
            MultipleBillPaymentsModel.fireBatch({
                batchDetailRequestList: [
                    {
                        methodType: "GET",
                        uri: { value: "/payments/registeredBillers" },
                        headers: {
                            "Content-Id": 1,
                            "Content-Type": "application/json"
                        }
                    },
                    {
                        methodType: "GET",
                        uri: { value: "/payments/billers?categoryType=ALL" },
                        headers: {
                            "Content-Id": 2,
                            "Content-Type": "application/json"
                        }
                    },
                    {
                        methodType: "GET",
                        uri: { value: "/payments/currentDate" },
                        headers: {
                            "Content-Id": 3,
                            "Content-Type": "application/json"
                        }
                    },
                    {
                        methodType: "GET",
                        uri: { value: "/maintenances/payments" },
                        headers: {
                            "Content-Id": 4,
                            "Content-Type": "application/json"
                        }
                    },
                    {
                        methodType: "GET",
                        uri: { value: "/payments/currencies?type=BILLPAYMENT" },
                        headers: {
                            "Content-Id": 5,
                            "Content-Type": "application/json"
                        }
                    }
                ]
            }).done(function (data) {
                for (var i = 0; i < data.batchDetailResponseDTOList.length; i++) {
                    if (Number(data.batchDetailResponseDTOList[i].sequenceId) === 1) {
                        self.supportingData.billerList = data.batchDetailResponseDTOList[i].responseObj;
                    } else if (Number(data.batchDetailResponseDTOList[i].sequenceId) === 2) {
                        self.supportingData.billerNames = data.batchDetailResponseDTOList[i].responseObj;
                    } else if (Number(data.batchDetailResponseDTOList[i].sequenceId) === 3) {
                        self.supportingData.currentDate = data.batchDetailResponseDTOList[i].responseObj;
                    } else if (Number(data.batchDetailResponseDTOList[i].sequenceId) === 4) {
                        maxPaymentsCount = Number(ko.utils.arrayFirst(data.batchDetailResponseDTOList[i].responseObj.configurationDetails, function (config) {
                            return config.propertyId === (Constants.userSegment === "CORP" ? "CORPORATE_MAX_MULTIPLE_BILL_PAYMENT_LIMIT" : "RETAIL_MAX_MULTIPLE_BILL_PAYMENT_LIMIT");
                        }).propertyValue);
                    } else {
                        self.supportingData.currencies = data.batchDetailResponseDTOList[i].responseObj;
                    }
                }
                self.supportingDataLoaded(true);
            });
        } else {
            self.supportingDataLoaded(true);
        }
        var allSuccess = true, validationError = false;
        self.unsavedTransactionsCount = ko.observable();
        self.savedTransactionsCount = ko.observable();
        self.getPlusOne = function (value) {
            return value + 1;
        };
        self.initiateMultiplePayment = function () {
            for (var j = 0; j < self.masterBatchArray().length; j++) {
                if (!Params.baseModel.showComponentValidationErrors(self.masterBatchArray()[j].validationTracker()))
                    validationError = true;
            }
            if (validationError)
                return;
            self.unsavedTransactionsCount(0);
            self.savedTransactionsCount(0);
            batchRequest.batchDetailRequestList = [];
            for (var i = 0; i < self.masterBatchArray().length; i++) {
                if (self.masterBatchArray()[i].autoPopulationData.showPaymentOverview()) {
                    batchRequest.batchDetailRequestList.push({
                        methodType: "POST",
                        uri: self.masterBatchArray()[i].uri,
                        payload: self.masterBatchArray()[i].payload,
                        headers: {
                            "Content-Id": self.masterBatchArray()[i].id,
                            "Content-Type": "application/json"
                        }
                    });
                    self.savedTransactionsCount(self.savedTransactionsCount() + 1);
                } else
                    self.unsavedTransactionsCount(self.unsavedTransactionsCount() + 1);
            }
            if (self.unsavedTransactionsCount() > 0 && self.savedTransactionsCount() > 0)
                $("#warning-unsaved").trigger("openModal");
            else
                self.postPaymentRequest();
        };
        self.closeModal = function () {
            $("#warning-unsaved").trigger("closeModal");
        };
        self.postPaymentRequest = function () {
            if (batchRequest.batchDetailRequestList.length === 0 && self.unsavedTransactionsCount() > 0) {
                Params.baseModel.showMessages(null, [self.resource.msg.atleastonetxnmsg], "ERROR");
                return;
            }
            MultipleBillPaymentsModel.fireBatch(batchRequest, "CMBP").done(function (data) {
                for (var i = 0; i < data.batchDetailResponseDTOList.length; i++) {
                    var obj = ko.utils.arrayFirst(self.masterBatchArray(), function (element) {
                        return element.id === Number(data.batchDetailResponseDTOList[i].sequenceId);
                    });
                    obj.isSuccess = data.batchDetailResponseDTOList[i].status === 201;
                    obj.response = data.batchDetailResponseDTOList[i].responseObj;
                    if (obj.isSuccess) {
                        obj.warning = obj.response.status.message.detail;
                    } else {
                        allSuccess = false;
                        var errorMessage = obj.response.message.validationError ? obj.response.message.validationError[0].errorMessage : obj.response.message.title || obj.response.message.detail;
                        obj.autoPopulationData.failureReason(errorMessage);
                        obj.autoPopulationData.txnFailed(true);
                        obj.autoPopulationData.showPaymentOverview(false);
                    }
                }
                if (allSuccess)
                    Params.dashboard.loadComponent("review-multiple-bill-payments", {
                        masterBatchArray: self.masterBatchArray(),
                        retainedData: self
                    }, self);
                else
                    allSuccess = true;
            });
            for (var i = 0; i < self.masterBatchArray().length; i++) {
                if (!self.masterBatchArray()[i].autoPopulationData.showPaymentOverview()) {
                    self.masterBatchArray().splice(i, 1);
                    i -= 1;
                }
            }
        };
        self.cancel = function () {
            history.back();
        };
        self.removePayment = function (sourceId) {
            self.refreshLabel(false);
            self.masterBatchArray.remove(function (element) {
                return element.id === sourceId;
            });
            ko.tasks.runEarly();
            self.refreshLabel(true);
        };
        self.addPayment = function (sourceId) {
            if (self.masterBatchArray().length === maxPaymentsCount) {
                Params.baseModel.showMessages(null, [Params.baseModel.format(self.resource.msg.maxPaymentCountLimitMsg, { count: maxPaymentsCount })], "ERROR");
                return;
            }
            var autoPopulationData = getNewKoModel();
            if (sourceId) {
                var obj = ko.utils.arrayFirst(self.masterBatchArray(), function (element) {
                    return element.id === sourceId;
                });
                autoPopulationData = ko.mapping.fromJS(ko.mapping.toJS(obj.autoPopulationData));
                autoPopulationData.payeeDetails = ko.observable(autoPopulationData.payeeDetails);
                autoPopulationData.overviewDetails = ko.observable(autoPopulationData.overviewDetails);
                autoPopulationData.showPaymentOverview = ko.observable(false);
            }
            self.masterBatchArray.push(getMasterArrayElement(autoPopulationData));
        };
    };
});