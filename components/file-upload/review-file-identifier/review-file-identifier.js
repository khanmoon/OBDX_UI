define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/review-file-identifier",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpopup"
], function (ko, $, FUIDViewModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("action-header");
        self.selectedFUID = self.params.data.fileIdentifierRegistrationDTO;
        self.Nls = resourceBundle.reviewFileIdentifier;
        self.approvalTypesMap = {};
        self.approvalTypes = ko.observableArray();
        self.transactionTypesMap = {};
        self.fileFormatTypesMap = {};
        self.accountTypesMap = {};
        self.fileTypesMap = {};
        self.isApprovalTypesLoaded = ko.observable(false);
        self.isTransactionTypesLoaded = ko.observable(false);
        self.isFileFormatTypesLoaded = ko.observable(false);
        self.isAccountTypesLoaded = ko.observable(false);
        self.isFileTypesLoaded = ko.observable(false);
        self.templateDetails = ko.observableArray();
        self.isTemplateDetailsLoaded = ko.observable(false);
        self.isPartyNameLoaded = ko.observable(false);
        self.back = function () {
            history.go(-1);
        };
        self.cancel = function () {
            self.startEditMode();
        };
        FUIDViewModel.fetchTemplateDetails(self.selectedFUID.templateId()).done(function (data) {
            self.templateDetails(data.templateDTO);
            self.isTemplateDetailsLoaded(true);
        });
        var url;
        if (self.userSegment === "ADMIN") {
            url = "parties?partyId=" + self.selectedFUID.partyId();
            FUIDViewModel.fetchPartyDetails(url).done(function (data) {
                self.selectedFUID.partyName = ko.observable(data.parties[0].personalDetails.fullName);
                self.isPartyNameLoaded(true);
            });
        } else if (self.userSegment === "CORPADMIN") {
            url = "me/party";
            FUIDViewModel.fetchPartyDetails(url).done(function (data) {
                self.selectedFUID.partyName = ko.observable(data.party.personalDetails.fullName);
                self.isPartyNameLoaded(true);
            });
        }
        FUIDViewModel.getApprovalTypes().done(function (data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.approvalTypes.push({
                    text: data.enumRepresentations[0].data[i].description,
                    value: data.enumRepresentations[0].data[i].code
                });
                self.approvalTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
            self.isApprovalTypesLoaded(true);
        });
        FUIDViewModel.getTransactionTypes().done(function (data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.transactionTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
            self.isTransactionTypesLoaded(true);
        });
        FUIDViewModel.getFileTypes().done(function (data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.fileTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
            self.isFileTypesLoaded(true);
        });
        FUIDViewModel.getFileFormatTypes().done(function (data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.fileFormatTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
            self.isFileFormatTypesLoaded(true);
        });
        FUIDViewModel.getAccountingTypes().done(function (data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.accountTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
            self.isAccountTypesLoaded(true);
        });
    };
});