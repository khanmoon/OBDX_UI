define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!resources/nls/payments-money-transfer",
    "framework/js/constants/constants",
    "ojs/ojinputnumber",
    "ojs/ojselectcombobox"
], function(oj, ko, $, domesticPaymentModel, BaseLogger, ResourceBundle, Constants) {
    "use strict";
    return function(Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.payments = ResourceBundle.payments;
        self.transactionPurpose = ko.observable("");
        self.transactionPurposeList = ko.observableArray();
        self.transactionPurposeMap = {};
        self.isPurposeListLoaded = ko.observable(false);
        self.paymentData = self.paymentData || ko.observable();
        self.domesticAccountDetails = ko.observable();
        self.purposeText = ko.observable();
        self.isDataLoaded = ko.observable(false);
        Params.baseModel.registerComponent("review-payment-domestic", "payments");
        domesticPaymentModel.init();
        self.purposeChanged = function(event) {
            if (event.detail.value) {
                self.otherPurpose(event.detail.value === "OTH_Other");
                if (event.detail.value !== "OTH_Other") {
                    self.otherPurposeValue("");
                }
            }
        };
        if (self.stageOne()) {
            domesticPaymentModel.getTransferPurpose().done(function(data) {
                self.isPurposeListLoaded(false);
                if (data.linkageList.length > 0) {
                    for (var i = 0; i < data.linkageList[0].purposeList.length; i++) {
                        if (self.purpose() && self.purpose().indexOf("_") < 0 && self.purpose() === data.linkageList[0].purposeList[i].code) {
                            self.purpose(self.purpose() + "_" + data.linkageList[0].purposeList[i].description);
                        }
                        self.transactionPurposeList.push({
                            text: data.linkageList[0].purposeList[i].description,
                            value: data.linkageList[0].purposeList[i].code
                        });
                    }
                    self.purposeFromFavourites();
                }
                self.isPurposeListLoaded(true);
            });
        } else if (self.stageTwo()) {
            var transferData = {
                header: Params.dashboard.headerName(),
                reviewMode: true
            };
            if (self.transferOn() === "later")
                transferData.instructionId = self.paymentId();
            else if (self.transferOn() === "now")
                transferData.paymentId = self.paymentId();
            Params.dashboard.loadComponent("review-payment-domestic", {
                transferData: transferData,
                retainedData: self
            }, self);
        }
        self.purposeFromFavourites = function() {
            if ((self.params && self.params.transferObject && self.params.transferObject().isFavoriteTransaction) || (self.defaultData && self.defaultData.transferObject)) {
                var data = self.params.transferObject ? self.params.transferObject() : self.defaultData.transferObject();
                if (data.purpose === "OTH") {
                    for (var i = 0; i < self.transactionPurposeList().length; i++) {
                        if (self.transactionPurposeList()[i].value === data.purpose) {
                            self.purpose(self.transactionPurposeList()[i].value + "_" + self.transactionPurposeList()[i].text);
                            break;
                        }
                    }
                    self.otherPurposeValue(data.otherPurposeText);
                    self.otherPurpose(true);
                } else {
                    for (var j = 0; j < self.transactionPurposeList().length; j++) {
                        if (self.transactionPurposeList()[j].value === data.purpose) {
                            self.purpose(self.transactionPurposeList()[j].value + "_" + self.transactionPurposeList()[j].text);
                            break;
                        }
                    }
                }
            }
        };
    };
});