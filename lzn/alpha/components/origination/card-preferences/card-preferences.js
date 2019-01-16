define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "paperAccordion"
], function (oj, ko, $, StructureSolutionModel) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        if (self.productDetails().currentStage) {
            self.productHeadingName(self.productDetails().currentStage.name);
        }
        self.showAddOn = ko.observable(false);
        self.renderScreen = ko.observable(false);
        self.indexCardAccount = 1;
        self.indexCardAddon = 2;
        self.indexCardFees = 3;
        self.dialogTitle = ko.observable("");
        self.dialogMessage = ko.observable("");
        self.cardaccountAccordion = ko.observable();
        self.accountCreated = ko.observable(false);
        self.initializeAccordion = function () {
            self.cardaccountAccordion($("#cardPreferenceAccordion").paperAccordion({
                disableOthers: true,
                zoom: false
            }));
        };
        self.components = ko.observableArray([{
                name: "deliveryPreferences",
                component: "card-account",
                icon: "icon-delivery-preferences",
                isComplete: ko.observable(false)
            }]);
        rootParams.baseModel.registerComponent("card-account", "origination");
        rootParams.baseModel.registerComponent("card-fees-charges", "origination");
        rootParams.baseModel.registerComponent("card-addon", "origination");
        StructureSolutionModel.init(self.productDetails().submissionId.value, self.productGroupSerialNumber());
        StructureSolutionModel.getSelectedOffer().done(function (data) {
            self.productDetails().offerId = data.offerDetails[0].offerId;
            if (data.offerDetails[0].offerAdditionalDetails && data.offerDetails[0].offerAdditionalDetails.cardOfferDetails && data.offerDetails[0].offerAdditionalDetails.cardOfferDetails.remarks && data.offerDetails[0].offerAdditionalDetails.cardOfferDetails.remarks[0]) {
                self.productDetails().applicationFees = data.offerDetails[0].offerAdditionalDetails.cardOfferDetails.remarks[0];
            } else {
                self.productDetails().applicationFees = data.offerDetails[0].applicationFees;
            }
            if (!self.productDetails().structureSolutionModel) {
                self.productDetails().structureSolutionModel = {};
                self.productDetails().structureSolutionModel.addressTemplate = {};
                self.productDetails().structureSolutionModel.addressTemplate.contactInfo = {};
                self.productDetails().structureSolutionModel.addressTemplate.contactInfo.address = {};
            }
            if (data.offerDetails[0].offerAdditionalDetails.cardOfferDetails.standardFeature.addOnCardAllowed) {
                self.components.push({
                    name: "addOnCardHolderDetails",
                    component: "card-addon",
                    icon: "icon-add-on-card",
                    isComplete: ko.observable(false)
                });
                self.showAddOn(true);
            } else {
                self.indexCardFees = 2;
            }
            self.components.push({
                name: "feesAndCharges",
                component: "card-fees-charges",
                icon: "icon-fees-charges",
                isComplete: ko.observable(false)
            });
            self.renderScreen(true);
        });
        self.showNextComponent = function (ind) {
            self.cardaccountAccordion().close(ind);
            if (ind < self.components().length) {
                self.cardaccountAccordion().open(ind + 1);
                self.cardaccountAccordion().enable(ind + 1);
            }
        };
        self.skipComponent = function (ind) {
            self.showNextComponent(ind);
        };
        self.handleOpen = function () {
            $("#modalDialog1").ojDialog("open");
        };
        self.handleOKClose = $("#okButton").click(function () {
            $("#modalDialog1").ojDialog("close");
        });
        self.submitFunction = function () {
            if (!self.accountCreated()) {
                $("#ERROR").trigger("openModal");
            } else {
                self.getNextStage();
            }
        };
    };
});