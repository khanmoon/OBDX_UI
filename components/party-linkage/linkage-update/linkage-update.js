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
], function (oj, ko, $, BaseLogger, UpdateLinkageModel, constants, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.showChildPartyValidateComponent = ko.observable(false);
        self.showAddedLinkedPartiesTable = ko.observable(true);
        self.childPartyId = ko.observable();
        self.childPartyName = ko.observable();
        self.isDataUpdated = ko.observable(false);
        self.linkedPartiesArray = ko.observable([]);
        self.linkedPartiesArray(self.fetchedLinkages().slice(0));
        self.showReviewComponent = ko.observable(false);
        rootParams.baseModel.registerComponent("child-party-validate", "party-linkage");
        self.loadLinkageReviewComponent = function () {
            self.reviewFor("edit");
            self.showReviewComponent(true);
        };
        var partyArray = [];
        ko.utils.arrayForEach(self.linkedPartiesArray(), function (item) {
            partyArray.push(item.relatedPartyId);
        });

        self.onBack = function() {
          if (!self.isDataUpdated()) {
            self.back();
          } else {
            self.showBackModalWidnow();
          }
        };

        self.back = function () {
            self.showStaticPartyInfo(true);
            self.isDataRecieved(true);
            self.isLinkageCreated(true);
            self.loadSummaryTable(true);
            self.loadUpdateComponent(false);
            self.isDataUpdated(false);
            $("#backConfirmationModal").hide();
        };
        self.cancelOnUpdate = function () {
            rootParams.dashboard.openDashBoard("nls.common.confirmationMessage");
        };
        self.showBackModalWidnow = function () {
            $("#backConfirmationModal").trigger("openModal");
        };
        var getNewKoModel = function () {
            var KoModel = UpdateLinkageModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.createLinkageModelInstance = ko.observable(getNewKoModel());
        self.linkedPartiesDatasource = new oj.ArrayTableDataSource(self.linkedPartiesArray(), { idAttribute: "relatedPartyId" });
        var createLinkageModelSubscriptions = self.createLinkageModelInstance().partyDetails.partyDetailsFetched.subscribe(function (flag) {
            if (flag) {
                UpdateLinkageModel.fetchPreferenceForParty(self.createLinkageModelInstance().partyDetails.partyId()).done(function (data) {
                    if (data.partyPreferencesDTOs && data.partyPreferencesDTOs.isEnabled) {
                        self.childPartyId(self.createLinkageModelInstance().partyDetails.partyId());
                        if (self.partyId() === self.createLinkageModelInstance().partyDetails.partyId()) {
                            rootParams.baseModel.showMessages(null, [self.nls.errors.parentPartyCheck], "ERROR");
                            self.createLinkageModelInstance().partyDetails.partyId("reset");
                            self.createLinkageModelInstance().partyDetails.partyId("");
                            self.createLinkageModelInstance().partyDetails.partyIdDisplay("reset");
                            self.createLinkageModelInstance().partyDetails.partyIdDisplay("");
                            self.createLinkageModelInstance().partyDetails.partyName("reset");
                            self.createLinkageModelInstance().partyDetails.partyName("");
                            self.createLinkageModelInstance().partyDetails.partyDetailsFetched(false);
                        } else if (partyArray.indexOf(self.childPartyId()) > -1) {
                            rootParams.baseModel.showMessages(null, [self.nls.errors.partyAddedAlready], "ERROR");
                            self.showChildPartyValidateComponent(false);
                        } else {
                            self.childPartyName(self.createLinkageModelInstance().partyDetails.partyName());
                            var party = {};
                            party.value = self.partyId();
                            var relatedParty = {};
                            relatedParty.value = self.childPartyId();
                            self.linkedPartiesArray().push({
                                party: party,
                                relatedParty: relatedParty,
                                relatedPartyId: self.childPartyId(),
                                relatedPartyName: self.childPartyName(),
                                relatedPartyIdDisplay: self.createLinkageModelInstance().partyDetails.partyIdDisplay(),
                                relatedPartyFirstName: self.createLinkageModelInstance().partyDetails.partyFirstName(),
                                relatedPartyLastName: self.createLinkageModelInstance().partyDetails.partyLastName()
                            });
                            partyArray.push(self.childPartyId());
                            self.isDataUpdated(true);
                            self.showAddedLinkedPartiesTable(false);
                            self.linkedPartiesDatasource.reset(self.linkedPartiesArray());
                            self.showAddedLinkedPartiesTable(true);
                            self.showChildPartyValidateComponent(false);
                        }
                    } else {
                        self.createLinkageModelInstance().partyDetails.partyId("reset");
                        self.createLinkageModelInstance().partyDetails.partyId("");
                        self.createLinkageModelInstance().partyDetails.partyIdDisplay("reset");
                        self.createLinkageModelInstance().partyDetails.partyIdDisplay("");
                        self.createLinkageModelInstance().partyDetails.partyName("reset");
                        self.createLinkageModelInstance().partyDetails.partyName("");
                        self.createLinkageModelInstance().partyDetails.partyDetailsFetched(false);
                        if (data.partyPreferencesDTOs && !data.partyPreferencesDTOs.isEnabled)
                            rootParams.baseModel.showMessages(null, [self.nls.errors.channelAccessCheck], "ERROR");
                        else
                            rootParams.baseModel.showMessages(null, [self.nls.errors.partyPreferenceCheck], "ERROR");
                    }
                });
            }
        });
        self.removeChildParty = function (context) {
            var data = context.row;
            UpdateLinkageModel.readPartyToPartyAccountSetup(data.party.value, data.relatedParty.value).done(function (serviceData) {
                if (serviceData.linkedPartyAccountAccessDTOs.length === 0) {
                    self.remove(self.linkedPartiesArray(), data.relatedPartyId);
                    var position = partyArray.indexOf(data.relatedPartyId);
                    partyArray.splice(position, 1);
                    self.isDataUpdated(true);
                } else {
                    rootParams.baseModel.showMessages(null, [self.nls.errors.p2paccountsetupexists], "ERROR");
                }
            });
        };
        self.remove = function (array, relatedPartyId) {
            ko.utils.arrayForEach(array, function (item) {
                if (item && relatedPartyId === item.relatedPartyId) {
                    var index = array.indexOf(item);
                    self.linkedPartiesArray().splice(index, 1);
                    self.linkedPartiesDatasource.reset(self.linkedPartiesArray());
                    self.showAddedLinkedPartiesTable(false);
                    self.showAddedLinkedPartiesTable(true);
                }
            });
        };
        self.addMoreRecords = function () {
            self.createLinkageModelInstance().partyDetails.partyId("reset");
            self.createLinkageModelInstance().partyDetails.partyId("");
            self.createLinkageModelInstance().partyDetails.partyIdDisplay("reset");
            self.createLinkageModelInstance().partyDetails.partyIdDisplay("");
            self.createLinkageModelInstance().partyDetails.partyName("reset");
            self.createLinkageModelInstance().partyDetails.partyName("");
            self.createLinkageModelInstance().partyDetails.partyDetailsFetched(false);
            self.showChildPartyValidateComponent(true);
            self.showAddedLinkedPartiesTable(false);
            self.showAddedLinkedPartiesTable(true);
        };
        self.dispose = function () {
            createLinkageModelSubscriptions.dispose();
        };

        self.hideModal = function() {
          $("#backConfirmationModal").hide();
        };

        self.columnsArray = [{
          "headerText": self.nls.common.partyID,
          "field": "relatedPartyIdDisplay"
        }, {
          "headerText": self.nls.common.partyName,
          "field": "relatedPartyName"
        }, {
          "headerText": self.nls.columnHeader.action,
          "renderer": oj.KnockoutTemplateUtils.getRenderer("delete_record", true)
        }];
    };
});
