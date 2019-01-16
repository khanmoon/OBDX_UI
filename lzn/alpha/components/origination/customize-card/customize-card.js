define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!lzn/alpha/resources/nls/customize-card",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext"
], function (oj, ko, $, customizeCardModelObject, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, customizeCardModel = new customizeCardModelObject();
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.productDetails().simulationId = ko.observable("");
        self.optedForBalanceTranser = ko.observable("OPTION_NO");
        self.optedForAddOnHolder = ko.observable("OPTION_NO");
        self.isAddOnHolder = ko.observable(false);
        rootParams.baseModel.registerComponent("card-addon", "origination");
        rootParams.baseModel.registerComponent("card-balance-transfer", "origination");
        self.accountDetailsLoaded = ko.observable(false);
        self.showContinue = ko.observable(true);
        self.submitAccountConfig = function () {
            self.disableSubmit(false);
            self.productDetails().currentStage.stages[0].isComplete(true);
            self.productDetails().currentStage.applicantAccordion().close(1);
        };
        customizeCardModel.fetchAccountDetails(self.productDetails().submissionId.value, self.productDetails().facilityId).done(function (data) {
            if (data.simulationId) {
                self.productDetails().simulationId(data.simulationId);
            }
            var sendDataForAccountCreation = {
                cardDeliveryMode: "HOME",
                pinDeliveryMode: "HOME",
                facilityId: self.productDetails().facilityId,
                statementDeliveryMode: "ONLINE",
                accountTitle: "Credit_Card_Application",
                offerId: self.productDetails().offers.offerId,
                cardDeliveryAddress: self.applicantDetails()[0].contactInfo.contactInfo.address.postalAddress,
                pinDeliveryAddress: self.applicantDetails()[0].contactInfo.contactInfo.address.postalAddress,
                cardDeliveryBranch: null,
                pinDeliveryBranch: null,
                currency: self.productDetails().offers.offerAdditionalDetails.allowedCurrencies[0].code,
                simulationId: self.productDetails().simulationId()
            };
            customizeCardModel.createDiliveryPreferences(self.productDetails().submissionId.value, sendDataForAccountCreation).done(function (data) {
                if (data.simulationID) {
                    self.productDetails().simulationId(data.simulationID);
                }
                self.productDetails().balanceTransferDetails = {};
                self.productDetails().addonDetails = {};
                self.accountDetailsLoaded(true);
            });
        });
    };
});