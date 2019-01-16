define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!lzn/beta/resources/nls/product-offers"
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
        self.isDisabled = ko.observable(true);
        self.noOffers = ko.observable(false);
        if (!self.productDetails().offers) {
            self.productDetails().offers = getNewKoModel();
        }
        OffersModel.init(self.productDetails().submissionId.value, self.productGroupSerialNumber());
        OffersModel.getOffers().done(function (data) {
            self.offers(data);
            if ($.isEmptyObject(data.offerDetails)) {
                self.noOffers(true);
                return;
            }
            self.dataLoaded(true);
            OffersModel.fetchSelectedOffer().done(function (data) {
                if (!$.isEmptyObject(data.offerDetails)) {
                    for (i = 0; i < self.offers().offerDetails.length; i++) {
                        if (self.offers().offerDetails[i].offerId === data.offerDetails[0].offerId) {
                            $("#offer" + i).addClass("selected");
                            self.isDisabled(false);
                            self.productDetails().offers.offerId = data.offerDetails[0].offerId;
                        }
                    }
                }
            });
        });
        self.submitProductOffer = function (index, offerId) {
            $("#offer" + index).toggleClass("selected");
            if ($("#offer" + index).hasClass("selected")) {
              self.isDisabled(false);
            } else {
              self.isDisabled(true);
            }
            for (i = 0; i < self.offers().offerDetails.length; i++) {
                if (index !== i) {
                    $("#offer" + i).removeClass("selected");
                }
            }
            for (i = 0; i < self.offers().offerDetails.length; i++) {
                if (self.offers().offerDetails[i].offerId === offerId) {
                    self.productDetails().offers.features = self.offers().offerDetails[i].features;
                    self.productDetails().offers.offerName = self.offers().offerDetails[i].offerName;
                    self.productDetails().offers.offerId = offerId;
                }
            }
            OffersModel.submitOffers(offerId).done(function () {
                self.offersLoaded(false);
            });
        };
        self.continue = function () {
            if (!self.productDetails().offers.offerName) {
                for (i = 0; i < self.offers().offerDetails.length; i++) {
                    if (self.offers().offerDetails[i].offerId === self.productDetails().offers.offerId) {
                        self.productDetails().offers.offerName = self.offers().offerDetails[i].offerName;
                    }
                }
            }
            if (self.landingComponent === "application-tracking-base") {
                self.uplTrackingDetails().additionalInfo.sections[rootParams.index].isComplete(true);
                self.showNextComponent(rootParams.index + 1);
            } else {
                self.productDetails().productStages[3].stages[rootParams.index].isComplete(true);
                self.showNextComponent(rootParams.index + 1);
            }
        };
    };
});
