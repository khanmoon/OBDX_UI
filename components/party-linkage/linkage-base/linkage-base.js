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
], function (oj, ko, $, BaseLogger, linkageModel, constants, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.componentId = ko.observable();
        self.setComponentId = function (id) {
            self.componentId(id);
        };
        self.loginTime = ko.observable();
        rootParams.baseModel.registerComponent("party-validate", "common");
        rootParams.baseModel.registerComponent("linkage-review", "party-linkage");
        rootParams.baseModel.registerComponent("linkage-update", "party-linkage");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerComponent("create-linkage", "party-linkage");
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("modal-window");
        self.showPartyValidateComponent = ko.observable(true);
        self.fetchedLinkages = ko.observableArray([]);
        self.loadUpdateComponent = ko.observable(false);
        self.partyId = ko.observable();
        self.partyName = ko.observable();
        self.partyDisplayName = ko.observable();
        self.showStaticPartyInfo = ko.observable(true);
        self.isDataRecieved = ko.observable(false);
        self.isLinkageCreated = ko.observable(false);
        self.loadSummaryTable = ko.observable(false);
        self.reviewFor = ko.observable("none");
        rootParams.dashboard.headerName(self.nls.headers.name);
        self.partyIdFetched = ko.observable(false);
        var getNewKoModel = function () {
            var KoModel = linkageModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.isCorpAdmin = ko.observable();
        var partyId = {};
        self.isBankAdmin = ko.observable(false);
        partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;
        partyId.displayValue = rootParams.dashboard.userData.userProfile.partyId.displayValue;
        var userProfile = {};
        userProfile.firstName = rootParams.dashboard.userData.userProfile.firstName;
        var rootModelInstanceSubscription = self.rootModelInstance().partyDetails.party.value.subscribe(function (updatedPartyID) {
            if (updatedPartyID === null || updatedPartyID === undefined || updatedPartyID === "") {
                self.partyId("");
                self.partyName("");
                self.partyDisplayName("");
            } else {
                self.partyId(self.rootModelInstance().partyDetails.party.value());
                self.partyName(self.rootModelInstance().partyDetails.partyName());
                self.partyDisplayName(self.rootModelInstance().partyDetails.party.displayValue());
                self.showPartyValidateComponent(false);
                if (self.partyIdFetched()) {
                    linkageModel.fetchLinkagesForPartyCorp().done(function (data) {
                        self.fetchedLinkages(self.parseDataForTable(data.partyToPartyRelationship));
                        if (self.fetchedLinkages() === undefined || self.fetchedLinkages().length <= 0) {
                            self.isDataRecieved(true);
                            self.isLinkageCreated(false);
                        } else {
                            self.linkagedataSource = new oj.ArrayTableDataSource(self.fetchedLinkages(), { idAttribute: "relatedPartyId" });
                            self.isLinkageCreated(true);
                            self.loadSummaryTable(true);
                        }
                    });
                } else {
                    linkageModel.fetchLinkagesForParty(self.partyId()).done(function (data) {
                        self.fetchedLinkages(self.parseDataForTable(data.partyToPartyRelationship));
                        if (self.fetchedLinkages() === undefined || self.fetchedLinkages().length <= 0) {
                            self.isDataRecieved(true);
                            self.isLinkageCreated(false);
                        } else {
                            self.linkagedataSource = new oj.ArrayTableDataSource(self.fetchedLinkages(), { idAttribute: "relatedPartyId" });
                            self.isLinkageCreated(true);
                            self.loadSummaryTable(true);
                        }
                    });
                }
            }
        });
        if (partyId.value) {
            self.rootModelInstance().partyDetails.party.value(partyId.value);
            self.rootModelInstance().partyDetails.partyName(userProfile.firstName);
            self.rootModelInstance().partyDetails.party.displayValue(partyId.displayValue);
            self.rootModelInstance().partyDetails.partyDetailsFetched(true);
            self.isCorpAdmin(true);
        } else {
            self.isCorpAdmin(false);
        }
        self.loadCreateComponent = ko.observable(false);
        self.loadLinkageCreationComponent = function () {
            linkageModel.fetchPreferenceForParty(self.partyId()).done(function (data) {
                if (data.partyPreferencesDTOs && data.partyPreferencesDTOs.isEnabled) {
                    self.showStaticPartyInfo(false);
                    self.loadCreateComponent(true);
                } else if (data.partyPreferencesDTOs && !data.partyPreferencesDTOs.isEnabled)
                        rootParams.baseModel.showMessages(null, [self.nls.errors.channelAccessCheck], "ERROR");
                    else
                        rootParams.baseModel.showMessages(null, [self.nls.errors.partyPreferenceCheck], "ERROR");
            });
        };
        self.loadLinkageUpdateComponent = function () {
            self.showStaticPartyInfo(false);
            self.loadSummaryTable(false);
            self.loadUpdateComponent(true);
        };
        self.parseDataForTable = function (array) {
            if (array && array.length) {
                for (var i = 0; i < array.length; i++) {
                    array[i].relatedPartyId = array[i].relatedParty.value;
                    array[i].relatedPartyIdDisplay = array[i].relatedParty.displayValue;
                    array[i].partyId = array[i].party.value;
                    array[i].partyIdDisplay = array[i].party.displayValue;

                }
            }
            return array;
        };
        self.back = function () {
            self.showPartyValidateComponent(true);
            self.rootModelInstance().partyDetails.partyId(self.partyId);
            self.rootModelInstance().partyDetails.partyName(self);
            self.rootModelInstance().partyDetails.party.value("");
            self.rootModelInstance().partyDetails.partyDetailsFetched(false);
            self.isDataRecieved(false);
            self.isLinkageCreated(false);
        };
        linkageModel.fetchMe().done(function (dataId) {
            if (dataId.userProfile.partyId.value) {
                self.partyIdFetched(true);
                linkageModel.fetchMeWithPartyName().done(function (data) {
                    if (data.party.personalDetails.fullName) {
                        self.rootModelInstance().partyDetails.partyDetailsFetched(true);
                        self.rootModelInstance().partyDetails.partyName(data.party.personalDetails.fullName);
                        self.rootModelInstance().partyDetails.party.displayValue(dataId.userProfile.partyId.displayValue);
                        self.rootModelInstance().partyDetails.party.value(dataId.userProfile.partyId.value);
                    }
                });
            } else {
                self.rootModelInstance().partyDetails.partyName(null);
                self.rootModelInstance().partyDetails.party.value(null);
                self.rootModelInstance().partyDetails.party.displayValue(null);
            }
        });
        self.dispose = function () {
            rootModelInstanceSubscription.dispose();
        };
    };
});
