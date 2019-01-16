define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model"
], function (oj, ko, $, TDModel) {
    "use strict";
    return function (rootParams) {
        var self = this, payload;
        ko.utils.extend(self, rootParams.rootModel);
        self.getNewKoModel = function () {
            var KoModel = TDModel.getNewModel();
            KoModel.requestedAmount = self.productDetails().requirements.requestedAmount.amount();
            KoModel.currency = self.productDetails().requirements.requestedAmount.currency;
            KoModel.requestedTenure = self.productDetails().requirements.requestedTenure;
            KoModel.frequency = self.productDetails().requirements.frequency;
            if (self.productDetails().requirements.productGroupSerialNumber) {
                KoModel.productGroupSerialNumber = self.productDetails().requirements.productGroupSerialNumber;
            } else {
                KoModel.productGroupSerialNumber = self.productGroupSerialNumber();
            }
            return KoModel;
        };
        payload = self.getNewKoModel();
        self.createTDAccountSuccessHandler = function () {
            self.getNextStage();
        };
        TDModel.createTDAccount(self.productDetails().submissionId.value, self.createTDAccountSuccessHandler, payload);
    };
});