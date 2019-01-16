define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/file-identifier-search",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojlistview",
    "ojs/ojpopup",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function(oj, ko, $, FISearchModel, resourceBundle) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("file-identifier-create", "file-upload");
        rootParams.baseModel.registerComponent("file-identifier-edit", "file-upload");
        rootParams.baseModel.registerComponent("file-identifier-view", "file-upload");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("party-validate", "common");
        rootParams.baseModel.registerElement("action-header");
        self.Nls = resourceBundle.fileIdentifierSearch;
        rootParams.dashboard.headerName(self.Nls.fIMaintenance);
        self.validationTracker = ko.observable();
        self.FIList = ko.observableArray();
        var FIMap = {};
        self.isFILoaded = ko.observable(false);
        self.selectedFUID = ko.observable();
        var count = 1;
        self.partyDetail = {
            partyName: null,
            partyId: null,
            personalDetails: null,
            partyFirstName: null,
            partyLastName: null,
            party: {
                value: null,
                displayValue: null
            },
            partyDetailsFetched: false
        };
        self.isBankAdmin = ko.observable(false);
        self.datasource = ko.observable();
        self.partyDetail = ko.mapping.fromJS(self.partyDetail);
        if (!rootParams.dashboard.userData.userProfile.partyId.value) {
            self.isBankAdmin(true);
        } else {
            self.isBankAdmin(false);
        }
        FISearchModel.fetchMe().done(function(partyId) {
            if (partyId.userProfile.partyId.value) {
                self.partyDetail.party.value(partyId.userProfile.partyId.value);
                self.partyDetail.party.displayValue(partyId.userProfile.partyId.displayValue);
                self.partyDetail.partyDetailsFetched(true);
                FISearchModel.fetchMeWithParty().done(function(dataName) {
                    self.partyDetail.partyName(dataName.party.personalDetails.fullName);
                    self.partyDetail.partyDetailsFetched(true);
                });
            }
        });
        self.additionalDetails = ko.observable();
        self.approvalTypesMap = {};
        self.approvalTypes = ko.observableArray();
        self.transactionTypesMap = {};
        self.isApprovalTypesLoaded = ko.observable(false);
        self.isTransactionTypesLoaded = ko.observable(false);
        self.showCreate = ko.observable(false);
        self.count = ko.observable(0);
        var partyDetails = self.partyDetail.partyDetailsFetched.subscribe(function(data) {
            if (!data) {
                self.isFILoaded(false);
            } else
                self.listFileIdentifiers(self.partyDetail.party.value());
        });
        self.dispose = function() {
            partyDetails.dispose();
        };
        self.back = function() {
            self.partyDetail.partyName("");
            self.partyDetail.partyId("");
            self.partyDetail.partyDetailsFetched(false);
        };
        self.renderSrNo = function() {
            if (count > self.FIList().length)
                count = 1;
            return count++;
        };
        self.listFileIdentifiers = function(partyId) {
            FISearchModel.listFileIdentifiers(partyId).done(function(data) {
                self.FIList.removeAll();
                for (var i = 0; i < data.fileIdentifierRegistrations.length; i++) {
                    data.fileIdentifierRegistrations[i].index = i + 1;
                    if (data.fileIdentifierRegistrations[i].fileTemplateDTO) {
                        data.fileIdentifierRegistrations[i].transactionDesc = self.transactionTypesMap[data.fileIdentifierRegistrations[i].fileTemplateDTO.transaction];
                    }
                    FIMap[data.fileIdentifierRegistrations[i].fileIdentifier] = data.fileIdentifierRegistrations[i];
                    data.fileIdentifierRegistrations[i].approvalDesc = self.approvalTypesMap[data.fileIdentifierRegistrations[i].approvalType];
                }
                self.FIList(data.fileIdentifierRegistrations);
                self.datasource(new oj.ArrayTableDataSource(self.FIList(), { idAttribute: "fileIdentifier" }));
                self.isFILoaded(true);
            });
        };
        FISearchModel.getApprovalTypes().done(function(data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.approvalTypes.push({
                    text: data.enumRepresentations[0].data[i].description,
                    value: data.enumRepresentations[0].data[i].code
                });
                self.approvalTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
            self.isApprovalTypesLoaded(true);
        });
        FISearchModel.getTransactionTypes().done(function(data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.transactionTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
            self.isTransactionTypesLoaded(true);
        });
        self.onUserSelected = function(id) {
            self.selectedFUID(FIMap[id]);
            rootParams.dashboard.loadComponent("file-identifier-view", {}, self);
        };
        self.create = function() {
            rootParams.dashboard.loadComponent("file-identifier-create", {}, self);
        };
    };
});