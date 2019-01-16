define([
    "knockout",
    "jquery",
    "ojs/ojcore",
    "./model",

    "ojL10n!resources/nls/party-validate",
    "ojs/ojinputtext",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable"
], function (ko, $, oj, PartyValidateModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.datasource = new oj.ArrayTableDataSource([]);
        self.partyDatasource = new oj.ArrayTableDataSource([]);
        self.partyDetails = rootParams.partyDetails;
        self.nls = resourceBundle;
        self.partyAdditionalDetails = rootParams.additionalDetails;
        self.targetUnit = rootParams.targetUnit;
        self.partyId = {
            value: ko.observable(""),
            displayValue: ko.observable("")
        };
        self.partyName = ko.observable();
        self.indirectedPartyId = ko.observable();
        self.validationTracker = ko.observable();
        self.validationTrackerForName = ko.observable();
        self.showList = ko.observable(false);
        self.showPartyList = ko.observable(false);
        self.fetchPartyDetails = function () {
            self.showList(false);
            self.partyDetails.partyDetailsFetched(false);
            PartyValidateModel.fetchDetails(self.partyId.value(), self.targetUnit,self.partyDetails.partyName()).done(function (data) {
                var partySearchList;
                partySearchList = data.parties;
                partySearchList = $.map(data.parties, function (party) {
                    party.partyName = party.personalDetails.firstName;
                    party.value = party.id.value;
                    party.displayValue = party.id.displayValue;
                    return party;
                });
                self.partyDatasource.reset(partySearchList, { idAttribute: "id" });
                self.partyDatasource.data = partySearchList;
                if (data.parties.length > 1) {
                    self.showPartyList(true);
                    self.partyDetails.partyDetailsFetched(false);
                } else if (data.parties.length === 1) {
                    self.partyId.displayValue(data.parties[0].id.displayValue);
                    self.indirectedPartyId(data.parties[0].id.value);
                    self.fetchDetailsWithIndirectedValue();
                }
            });
        };
        self.fetchDetailsWithIndirectedValue = function () {
            self.showList(false);
            self.partyDetails.partyDetailsFetched(false);
            PartyValidateModel.fetchDetailsWithIndirectedValue(self.indirectedPartyId(), self.targetUnit).done(function (data) {
                self.partyAdditionalDetails(data);
                self.partyDetails.partyName(data.party.personalDetails.fullName);
                self.partyDetails.partyFirstName(data.party.personalDetails.firstName);
                self.partyDetails.partyLastName(data.party.personalDetails.lastName);
                self.partyDetails.partyDetailsFetched(true);
                self.partyDetails.party.value(data.party.id.value);
                self.partyDetails.party.displayValue(data.party.id.displayValue);
                self.showPartyList(false);
            });
        };
        if (rootParams.partyDetails.party.value !== null && rootParams.partyDetails.party.value !== "" && typeof rootParams.partyDetails.party.value === "string") {
            self.partyId.value(rootParams.partyDetails.party.value);
            self.indirectedPartyId(rootParams.partyDetails.party.value);
            self.fetchPartyDetails();
        }
        self.reset = function () {
            self.partyAdditionalDetails("");
            self.showList(false);
            self.showPartyList(false);
            self.partyId.value("");
            self.partyName("");
            self.partyDetails.partyName("");
            self.partyDetails.partyDetailsFetched(false);
            self.partyDetails.party.value("");
            self.partyDetails.party.displayValue("");
        };
        var partyValue = rootParams.partyDetails.party.value.subscribe(function () {
            if (rootParams.partyDetails.party.value() === "") {
                self.partyId.value(rootParams.partyDetails.party.value());
            }
        });
        self.dispose = function () {
            partyValue.dispose();
        };
        self.fetchPartyDetailsByName = function () {
            self.partyName(self.partyDetails.partyName());
            PartyValidateModel.fetchDetailsByName(self.partyDetails.partyName(), self.targetUnit).done(function (data) {
                var partyList;
                partyList = data.parties;
                partyList = $.map(data.parties, function (party) {
                    party.partyName = party.personalDetails.firstName;
                    party.value = party.id.value;
                    party.displayValue = party.id.displayValue;
                    return party;
                });
                self.datasource.reset(partyList, { idAttribute: "id" });
                self.datasource.data = partyList;
                if (data.parties.length > 1) {
                    self.showList(true);
                    self.partyDetails.partyDetailsFetched(false);
                } else if (data.parties.length === 1) {
                    self.indirectedPartyId(data.parties[0].id.value);
                    self.partyId.displayValue(data.parties[0].id.displayValue);
                    self.fetchDetailsWithIndirectedValue();
                }
            });
        };
        self.fetchApprovalDetailForParty = function (data) {
            self.partyDetails.partyId(data.id);
            self.partyId.value(rootParams.partyDetails.party.value);
            self.indirectedPartyId(rootParams.partyDetails.party.value);
            self.partyDetails.partyName(data.partyName);
            self.fetchPartyDetails();
            self.partyDetails.partyDetailsFetched(true);
            self.showList(false);
        };
        self.goToMap = function (data) {
            self.partyDetails.party.value(data.id.value);
            self.partyDetails.party.displayValue(data.id.displayValue);
            self.indirectedPartyId(rootParams.partyDetails.party.value());
            self.partyDetails.partyName(data.partyName);
            self.fetchDetailsWithIndirectedValue();
            self.showList(false);
        };
        self.validateParty = function () {
            if (self.partyId.value()) {
                self.fetchPartyDetails();
            } else if (self.partyDetails.partyName()) {
                self.showPartyList(false);
                self.fetchPartyDetailsByName();
            } else if (!self.partyId.value() && !self.partyDetails.partyName()) {
                rootParams.baseModel.showMessages(null, [self.nls.noDescription], "ERROR");
            }
        };
        self.submitIfEnter = function (data, event) {
            if (event.keyCode === 13) {
                self.validateParty();
            }
        };
    };
});