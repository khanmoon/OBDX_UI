define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "./model",
    "framework/js/constants/constants",
    "ojL10n!resources/nls/party-linkage",
    "ojs/ojtable",
    "ojs/ojknockout-validation"
], function (oj, ko, $, BaseLogger, LinkageReviewModel, constants, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.loadSummaryTable = ko.observable(false);
        self.transactionStatus = ko.observable();
        self.showConfirmationScreen = ko.observable(false);
        if (self.transactionDetails && self.transactionDetails() && self.transactionDetails().transactionSnapshot.partyToPartyRelationshipDataDTOs && self.transactionDetails().transactionSnapshot.partyToPartyRelationshipDataDTOs) {
            self.party = self.transactionDetails().partyId;
            self.partyId = self.transactionDetails().partyId.value;
            self.partyName = self.transactionDetails().partyName.fullName;
            self.partyDisplayName = self.transactionDetails().partyId.displayValue;
            if (self.transactionDetails().transactionName === "CP_LIN")
                self.isLinkageCreated = ko.observable(false);
            else if (self.transactionDetails().transactionName === "UP_LIN")
                self.isLinkageCreated = ko.observable(true);
            self.linkedPartiesArray = ko.observableArray(self.transactionDetails().transactionSnapshot.partyToPartyRelationshipDataDTOs);
            var parsedDataForCasa = $.map(ko.utils.unwrapObservable(self.linkedPartiesArray()), function (val) {


                val.relatedPartyId = val.relatedParty.value;
                val.relatedPartyIdDisplay = val.relatedParty.displayValue;

                return val;
            });
            self.linkagesForReview = new oj.ArrayTableDataSource(parsedDataForCasa, { idAttribute: "relatedPartyId" });
            self.loadSummaryTable = ko.observable(true);
        } else {
            self.loadSummaryTable(true);
            self.linkagesForReview = new oj.ArrayTableDataSource(self.linkedPartiesArray(), { idAttribute: "relatedPartyId" });
        }
        self.referenceNumber = ko.observable();
        self.back = function () {
            if (self.reviewFor() === "create") {
                self.reviewFor("none");
                self.showReviewComponent(false);
                self.isLinkageCreated(true);
                self.loadSummaryTable(true);
                self.loadUpdateComponent(false);
            }
            if (self.reviewFor() === "edit") {
                self.reviewFor("none");
                self.showReviewComponent(false);
                self.isLinkageCreated(true);
                self.loadSummaryTable(false);
                self.loadUpdateComponent(true);
            }
        };
        self.formatArrayForSubmit = function (array) {
            self.formattedArray = ko.observableArray([]);
            if (array && array.length) {
                for (var i = 0; i < array.length; i++) {
                    var object = {};
                    object.party = array[i].party;
                    object.relatedParty = array[i].relatedParty;
                    object.relationshipCode = array[i].relationshipCode;
                    object.relatedPartyName = array[i].relatedPartyName;
                    self.formattedArray().push(object);
                }
            }
            return self.formattedArray();
        };
        self.cancelOnReview = function () {
            rootParams.dashboard.openDashBoard("nls.common.confirmationMessage");
        };
        self.confirmLinkageReview = function () {
            var dataToBeSent = {};
            var partyData = {};
            partyData.value = self.partyId();
            dataToBeSent.party = partyData;
            dataToBeSent.partyToPartyRelationshipDataDTOs = self.formatArrayForSubmit(self.linkedPartiesArray());
            if (self.reviewFor() === "create") {
                LinkageReviewModel.createLinkages(self.partyId(), ko.toJSON(dataToBeSent)).done(function (data, status, jqXhr) {
                    self.transactionStatus(data.result);
                    self.referenceNumber(data.referenceNumber);
                    self.showConfirmationScreen(true);
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.nls.headers.name
                    }, self);
                });
            }
            if (self.reviewFor() === "edit") {
                LinkageReviewModel.updateLinkages(self.partyId(), ko.toJSON(dataToBeSent)).done(function (data, status, jqXhr) {
                    self.transactionStatus(data.result);
                    self.referenceNumber(data.referenceNumber);
                    self.showConfirmationScreen(true);
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.nls.headers.name
                    }, self);
                });
            }
        };
    };
});