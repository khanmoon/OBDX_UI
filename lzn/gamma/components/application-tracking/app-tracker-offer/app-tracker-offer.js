define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!lzn/gamma/resources/nls/application-offer",
    "ojs/ojcheckboxset"
], function (oj, ko, $, ApplicationOfferModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.headingText(self.resource.offer);
        self.dataLoaded = ko.observable(true);
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