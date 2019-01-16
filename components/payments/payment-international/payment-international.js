define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/payments-money-transfer",
    "framework/js/constants/constants",
    "ojs/ojinputnumber",
    "ojs/ojselectcombobox"
], function (oj, ko, $, internationalPaymentModel, ResourceBundle, Constants) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.payments = ResourceBundle.payments;
        self.paymentDetail = ko.observable("");
        self.paymentDetails = ko.observableArray();
        self.correspondenceCharge = ko.observable("");
        self.correspondenceCharges = ko.observableArray();
        self.isChargesLoaded = ko.observable();
        self.correspondenceChargesMap = {};
        self.purpose(null);
        Params.baseModel.registerComponent("review-payment-international", "payments");
        internationalPaymentModel.init();
        if (self.stageOne()) {
            internationalPaymentModel.getCorrespondenceCharges().done(function (data) {
                self.isChargesLoaded(false);
                for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                    self.correspondenceCharges.push({
                        text: data.enumRepresentations[0].data[i].description,
                        value: data.enumRepresentations[0].data[i].code
                    });
                }
                self.correspondanceChrgFromFavourites();
                ko.tasks.runEarly();
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
            Params.dashboard.loadComponent("review-payment-international", {
                transferData: transferData,
                retainedData: self
            }, self);
        }
        self.correspondanceChrgFromFavourites = function () {
            if ((self.params.transferObject && self.params.transferObject().isFavoriteTransaction) || (self.defaultData && self.defaultData.transferObject)) {
                var data = self.params.transferObject ? self.params.transferObject() : self.defaultData.transferObject();
                for (var j = 0; j < self.correspondenceCharges().length; j++) {
                    if (self.correspondenceCharges()[j].value === data.charges) {
                        self.charges(self.correspondenceCharges()[j].value + "_" + self.correspondenceCharges()[j].text);
                        break;
                    }
                }
            }
        };
    };
});