define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!lzn/beta/resources/nls/application-offer",
    "ojs/ojcheckboxset"
], function (oj, ko, $, ApplicationOfferModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.headingText(self.resource.offer);
        self.dataLoaded = ko.observable(false);
        self.offerDocumentList = ko.observable([]);
        self.offerAccepted = ko.observable("");
        self.dialogTitle = ko.observable("");
        self.dialogMessage = ko.observable("");
        self.isLoaded = ko.observable(true);
        self.userProcessed = ko.observable(false);
        self.agreement = ko.observableArray([]);
        self.tempMessageOffer = ko.observable();
        self.isRejected = ko.observable(false);
        self.tempErrCodeOffer = ko.observable();
        self.disableButtons = ko.computed(function () {
            if (self.agreement().length === self.currentUser().noOfApplicants) {
                return false;
            }
                return true;

        }, self);
        self.loggedInUser = ko.utils.arrayFilter(self.appDetails().coApplicants, function (stage) {
            if (stage.applicantId.value === self.currentUser().partyId.value) {
                return stage;
            }
        });
        self.userProcessed(true);
        self.handleOpen = function () {
            $("#modalDialog1").trigger("openModal");
        };
        self.handleOKClose = $("#okButton").click(function () {
            $("#modalDialog1").trigger("closeModal");
        });
        self.acceptOffer = function () {
            self.isOfferAccepted(true);
            ApplicationOfferModel.sendOfferStatus(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), "ACCEPT").done(function () {
                $("#ACCEPTOFFER").trigger("openModal");
            }).fail(function (data) {
                if (data.responseJSON.message.validationError && data.responseJSON.message.validationError[0]) {
                    self.tempMessageOffer(data.responseJSON.message.validationError[0].errorMessage);
                } else {
                    self.tempMessageOffer(self.resource.messages.offerAcceptenceError);
                }
                $("#customPopupforDuplicateOffer").trigger("openModal");
                if (data.responseJSON.message.validationError && data.responseJSON.message.validationError[0].errorCode === "DIGX_OR_APTR_0019") {
                    self.tempErrCodeOffer(data.responseJSON.message.validationError[0].errorCode);
                }
            });
        };
        self.redirectHomeOffer = function () {
            $("#customPopupforDuplicateOffer").trigger("closeModal");
            if (self.tempErrCodeOffer() === "DIGX_OR_APTR_0019") {
                self.clickBackButton();
            }
        };
        self.rejectOffer = function () {
            self.isOfferAccepted(false);
            ApplicationOfferModel.sendOfferStatus(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), "REJECT").done(function () {
                $("#REJECTOFFER").trigger("openModal");
            }).fail(function (data) {
                if (data.responseJSON.message.validationError && data.responseJSON.message.validationError[0]) {
                    self.tempMessageOffer(data.responseJSON.message.validationError[0].errorMessage);
                } else {
                    self.tempMessageOffer(self.resource.messages.offerRejectionError);
                }
                $("#customPopupforDuplicateOffer").trigger("openModal");
                if (data.responseJSON.message.validationError && data.responseJSON.message.validationError[0].errorCode === "DIGX_OR_APTR_0019") {
                    self.tempErrCodeOffer(data.responseJSON.message.validationError[0].errorCode);
                }
            });
        };
        self.close = function () {
            $("#ACCEPTOFFER").trigger("closeModal");
            $("#REJECTOFFER").trigger("closeModal");
            self.isLoaded(false);
        };
        ApplicationOfferModel.fetchOfferDocuments(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function (data) {
            if (!data.offerDocuments) {
                ApplicationOfferModel.fetchApplicationHistory(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function (data) {
                    var rejectedStatus = ko.utils.arrayFilter(data.statusUpdateDetails, function (stage) {
                        if (stage.currentStatus === "APPLICATION_OFFER_LETTER_REJECTED") {
                            return stage;
                        }
                    });
                    if (rejectedStatus.length > 0) {
                        self.isRejected(true);
                    }
                });
            }
            var isDocumentStatusPresent = data.offerDocuments && data.offerDocuments.length > 0 && data.offerDocuments[0].documentStatus;
            if (isDocumentStatusPresent && (data.offerDocuments[0].documentStatus === "ACCEPTED" || data.offerDocuments[0].documentStatus === "REJECTED")) {
                self.offerAccepted(data.offerDocuments[0].documentStatus);
            }
            self.offerDocumentList(data.offerDocuments);
            self.dataLoaded(true);
        });
        self.downloadDocument = function (documentReferenceId) {
            if (documentReferenceId) {
                ApplicationOfferModel.fetchDocumentsByteArray(documentReferenceId);
            }
        };
        self.dispose = function () {
            self.disableButtons.dispose();
        };
    };
});