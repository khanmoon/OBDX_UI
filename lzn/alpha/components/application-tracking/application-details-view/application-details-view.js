define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!lzn/alpha/resources/nls/application-details-view",
    "ojs/ojswitch"
], function (oj, ko, $, AdditionalInfoModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, i;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.headingText(self.resource.application);
        self.dataLoaded = ko.observable(false);
        self.applicationInfoAccordion = ko.observable({});
        self.applicationFormId = ko.observable("");
        self.documentReferenceId = ko.observable("");
        self.showApplicationForm = ko.observable(false);
        self.detailsLoaded = ko.observable(false);
        self.applicationSummaryLoaded = ko.observable(false);
        self.addressesForBranches = ko.observableArray([]);
        self.stateOptions = ko.observableArray([]);
        self.primaryApplicant = ko.observable();
        self.addressesForParty = ko.observable({
            HOME: {},
            POSTAL: {}
        });
        self.feeAmount = {
            amount: 0,
            currency: "USD"
        };
        self.documentName = ko.observable(self.applicationInfo().currentSubmissionId() + ".rtf");
        self.appDetails().loanApplicationDate = new Date(self.appDetails().loanApplicationDate).toDateString();
        if (self.productSubClassName() !== "PAYDAY") {
            AdditionalInfoModel.fetchApplicationForm(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function (data) {
                self.dataLoaded(false);
                if (data.applicationDocumentDTO && data.applicationDocumentDTO.id && data.applicationDocumentDTO.documentReferenceNo) {
                    self.applicationFormId(data.applicationDocumentDTO.id);
                    self.documentReferenceId(data.applicationDocumentDTO.documentReferenceNo.value);
                    self.documentName(data.documentName);
                    self.showApplicationForm(true);
                } else {
                    self.showApplicationForm(false);
                }
                self.dataLoaded(true);
            }).fail(function () {
                self.showApplicationForm(false);
            });
        }
        if (self.productClassName() === "CREDIT_CARD") {
            AdditionalInfoModel.fetchSelectedOfferDetails(self.appDetails().creditCardSummaryResponse.offerId).done(function (offerData) {
                self.offerDetails = offerData;
                var addOnHolders = [];
                for (var i = 0; i < self.appDetails().coApplicants.length; i++) {
                    if (self.appDetails().coApplicants[i].applicantRelationshipType === "ADDON_CARDHOLDER") {
                        addOnHolders.push(self.appDetails().coApplicants[i]);
                    }
                }
                self.appDetails().addOnCardHolderDetails = addOnHolders;
                self.detailsLoaded(true);
            });
        }
        if (self.productClassName() === "CREDIT_CARD") {
            var applicantId = null;
            var country = null;
            for (i = 0; i < self.appDetails().coApplicants.length; i++) {
                if (self.appDetails().coApplicants[i].applicantRelationshipType === "APPLICANT") {
                    self.primaryApplicant(self.appDetails().coApplicants[i]);
                    applicantId = self.appDetails().coApplicants[i].applicantId.value;
                    break;
                }
            }
            AdditionalInfoModel.fetchAddresses(applicantId).done(function (data) {
                if (data.partyAddressDTO) {
                    for (var i = 0; i < data.partyAddressDTO.length; i++) {
                        if (data.partyAddressDTO[i].type === "RES") {
                            self.addressesForParty().HOME = data.partyAddressDTO[i].postalAddress;
                            self.addressesForParty().HOME.stateName = data.partyAddressDTO[i].stateName;
                            country = data.partyAddressDTO[i].postalAddress.country;
                        } else if (data.partyAddressDTO[i].type === "PST") {
                            self.addressesForParty().POSTAL = data.partyAddressDTO[i].postalAddress;
                            self.addressesForParty().POSTAL.stateName = data.partyAddressDTO[i].stateName;
                        }
                    }
                    if (country) {
                        AdditionalInfoModel.fetchStates(country).done(function (data) {
                            self.stateOptions(data.enumRepresentations[0].data);
                            self.appDetails().creditCardSummaryResponse.creditCardAccount.cardDeliveryAddress.stateName = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.appDetails().creditCardSummaryResponse.creditCardAccount.cardDeliveryAddress.state);
                            self.appDetails().creditCardSummaryResponse.creditCardAccount.pinDeliveryAddress.stateName = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.appDetails().creditCardSummaryResponse.creditCardAccount.pinDeliveryAddress.state);
                            if (self.appDetails().creditCardSummaryResponse.creditCardAccount.cardDeliveryMode === "BRANCH" || self.appDetails().creditCardSummaryResponse.creditCardAccount.pinDeliveryMode === "BRANCH") {
                                AdditionalInfoModel.fetchBranches(self.applicationInfo().currentSubmissionId()).done(function (data) {
                                    if (data.addressDTO) {
                                        self.addressesForBranches(data.addressDTO);
                                    }
                                    for (var i = 0; i < self.addressesForBranches().length; i++) {
                                        if (self.appDetails().creditCardSummaryResponse.creditCardAccount.cardDeliveryMode === "BRANCH" && self.addressesForBranches()[i].branchCode === self.appDetails().creditCardSummaryResponse.creditCardAccount.cardDeliveryBranch) {
                                            self.appDetails().creditCardSummaryResponse.creditCardAccount.cardDeliveryAddress.branchName = self.addressesForBranches()[i].branchName;
                                        } else if (self.appDetails().creditCardSummaryResponse.creditCardAccount.pinDeliveryMode === "BRANCH" && self.addressesForBranches()[i].branchCode === self.appDetails().creditCardSummaryResponse.creditCardAccount.pinDeliveryBranch) {
                                            self.appDetails().creditCardSummaryResponse.creditCardAccount.pinDeliveryAddress.branchName = self.addressesForBranches()[i].branchName;
                                        }
                                    }
                                    self.applicationSummaryLoaded(true);
                                });
                            } else {
                                self.applicationSummaryLoaded(true);
                            }
                        });
                    }
                }
            });
        }
        self.formatMaturityDate = function (date) {
            var year = date.substr(0, 4);
            var month = date.substr(5, 2);
            var day = date.substr(8, 2);
            return month + "-" + day + "-" + year;
        };
        self.downloadDocument = function () {
            if (self.documentReferenceId()) {
                AdditionalInfoModel.fetchDocumentsByteArray(self.documentReferenceId(), self.appDetails().coApplicants[0].applicantId.value);
            }
        };
    };
});
