define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!resources/nls/product-offers"
], function (oj, ko, $, OffersModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, i = 0, getNewKoModel = function () {
                var KoModel = OffersModel.getNewModel();
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.applicantObject = rootParams.applicantObject;
        self.dataLoaded = ko.observable(false);
        self.offers = ko.observable();
        self.resource = resourceBundle;
        self.noOffers = ko.observable(false);
        self.offerSelected = ko.observable(false);
        if (!self.productDetails().offers) {
            self.productDetails().offers = getNewKoModel();
        }
        var requirementPayload = {};
        OffersModel.init(self.productDetails().submissionId.value, self.productDetails().productCode);
        OffersModel.getOffers().done(function (data) {
            if (data.products && data.products[0] && data.products[0].offersList) {
                self.offers(data.products[0].offersList);
            }
            if ($.isEmptyObject(data.products[0].offersList)) {
                self.noOffers(true);
                return;
            }
            self.dataLoaded(true);
            OffersModel.fetchRequirements().done(function (data) {
                if (!$.isEmptyObject(data.loanApplicationRequirementDTO)) {
                    requirementPayload = JSON.parse(JSON.stringify(data.loanApplicationRequirementDTO));
                    OffersModel.fetchSubmissionSummary().done(function (data) {
                        if (data.offerCode) {
                            for (i = 0; i < self.offers().length; i++) {
                                if (self.offers()[i].offerCode === data.offerCode) {
                                    $("#offer" + i).addClass("selected");
                                    self.offerSelected(true);
                                    self.productDetails().offers.offerId = data.offerCode;
                                }
                            }
                        }
                    });
                }
            });
        });
        self.submitProductOffer = function (index, offerCode) {
            $("#offer" + index).toggleClass("selected");
            for (i = 0; i < self.offers().length; i++) {
                if (index !== i) {
                    $("#offer" + i).removeClass("selected");
                }
            }
            for (i = 0; i < self.offers().length; i++) {
                if (self.offers()[i].offerCode === offerCode) {
                    self.productDetails().offers.features = self.offers()[i].features;
                    self.productDetails().offers.offerName = self.offers()[i].offerName;
                    self.productDetails().offers.offerId = offerCode;
                    self.offerSelected(false);
                    if ($("#offer" + i).attr("class").match("selected")) {
                        self.offerSelected(true);
                    }
                }
            }
        };
        self.continue = function () {
            if (self.offerSelected()) {
                if (!self.productDetails().offers.offerName) {
                    for (i = 0; i < self.offers().length; i++) {
                        if (self.offers()[i].offerCode === self.productDetails().offers.offerId) {
                            self.productDetails().offers.offerName = self.offers()[i].offerName;
                        }
                    }
                }
                requirementPayload.offerId = self.productDetails().offers.offerId;
                var url = "submissions/{submissionId}/loanApplications";
                OffersModel.submitRequirements(url, self.toCleanJson(requirementPayload)).done(function () {
                    self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
                });
            } else {
                $("#offerSelect").trigger("openModal");
            }
        };
    };
});