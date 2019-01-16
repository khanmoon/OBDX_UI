define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/payments-money-transfer",
    "ojL10n!resources/nls/review-payment-domestic",
    "framework/js/constants/constants",
    "ojs/ojselectcombobox"
], function(oj, ko, $, domesticPaymentModel, ukResourceBundle, ResourceBundle, Constants) {
    "use strict";
    return function(Params) {
        var self = this,
            i = 0;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.paymentType = ko.observable();
        self.resource = ResourceBundle;
        self.payments = ukResourceBundle.payments;
        self.purposeText = ko.observable();
        self.isDataLoaded = ko.observable(false);
        self.paymentTypeMap = {
            URG: self.payments.payee.domestic.uk.URGENT,
            NOU: self.payments.payee.domestic.uk["NON URGENT"],
            FAS: self.payments.payee.domestic.uk.FASTER
        };
        self.correspondenceCharges = ko.observableArray();
        self.isChargesLoaded = ko.observable(false);
        self.paymentTypeLoaded = ko.observable(false);
        self.transactionPurposeList = ko.observableArray();
        self.transactionPurposeMap = {};
        self.isTransactionPurposeListLoaded = ko.observable(true);
        domesticPaymentModel.init();
        Params.baseModel.registerComponent("review-payment-domestic", "payments");
        self.purposeChanged = function(event) {
            if (event.detail.value) {
                self.otherPurpose(event.detail.value === "OTH_Other");
                if (event.detail.value === "OTH_Other")
                    self.purpose("");
            }
        };
        if (self.stageOne()) {
            $.when(domesticPaymentModel.getTransferPurpose(), domesticPaymentModel.getCorrespondenceCharges(), domesticPaymentModel.getPayeeData(self.customPayeeId(), self.groupId(), "domestic")).then(function(transferPurposeResponse, correspondenceChargesResponse, payeeDataResponse) {
                self.isTransactionPurposeListLoaded(false);
                self.isChargesLoaded(false);
                self.paymentTypeLoaded(false);
                self.transactionPurposeList.removeAll();
                for (i = 0; i < transferPurposeResponse.linkageList[0].purposeList.length; i++) {
                    self.transactionPurposeList.push({
                        text: transferPurposeResponse.linkageList[0].purposeList[i].description,
                        value: transferPurposeResponse.linkageList[0].purposeList[i].code
                    });
                    self.transactionPurposeMap[transferPurposeResponse.linkageList[0].purposeList[i].code] = transferPurposeResponse.linkageList[0].purposeList[i].description;
                }
                self.correspondenceCharges.removeAll();
                for (i = 0; i < correspondenceChargesResponse.enumRepresentations[0].data.length; i++) {
                    self.correspondenceCharges.push({
                        text: correspondenceChargesResponse.enumRepresentations[0].data[i].description,
                        value: correspondenceChargesResponse.enumRepresentations[0].data[i].code
                    });
                }
                self.purposeFromFavourites();
                self.isTransactionPurposeListLoaded(true);
                self.paymentType(payeeDataResponse.domesticPayee.ukDomesticPayee ? payeeDataResponse.domesticPayee.ukDomesticPayee.paymentType :payeeDataResponse.domesticPayee.paymentType);
                self.paymentTypeLoaded(true);
                self.isChargesLoaded(true);
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
            if (self.params.transferObject && self.params.transferObject().isFavoriteTransaction) {
                if (self.params.transferObject().purpose === "OTH") {
                    for (i = 0; i < self.transactionPurposeList().length; i++) {
                        if (self.transactionPurposeList()[i].value === self.params.transferObject().purpose) {
                            self.purpose(self.transactionPurposeList()[i].value + "_" + self.transactionPurposeList()[i].text);
                            break;
                        }
                    }
                    self.otherPurposeValue(self.params.transferObject().otherPurposeText);
                    self.otherPurpose(true);
                } else {
                    for (i = 0; i < self.transactionPurposeList().length; i++) {
                        if (self.transactionPurposeList()[i].value === self.params.transferObject().purpose) {
                            self.purpose(self.transactionPurposeList()[i].value + "_" + self.transactionPurposeList()[i].text);
                            break;
                        }
                    }
                }
                for (var j = 0; j < self.correspondenceCharges().length; j++) {
                    if (self.correspondenceCharges()[j].value === self.params.transferObject().charges) {
                        self.charges(self.correspondenceCharges()[j].value + "_" + self.correspondenceCharges()[j].text);
                        break;
                    }
                }
            }
        };
    };
});