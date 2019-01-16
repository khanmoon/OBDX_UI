define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/party-linkage",
    "ojs/ojinputtext",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable"
], function (oj, ko, $, PartyValidateModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.datasource = new oj.ArrayTableDataSource([]);
        self.partyDatasource = new oj.ArrayTableDataSource([]);
        self.partyDetails = rootParams.partyDetails;
        self.nls = resourceBundle;
        self.partyAdditionalDetails = rootParams.additionalDetails;
        self.partyId = ko.observable();
        self.partyName = ko.observable();
        self.validationTracker = ko.observable();
        self.validationTrackerForName = ko.observable();
        self.showList = ko.observable(false);
        self.showPartyList = ko.observable(false);
        self.indirectedPartyId = ko.observable();
        self.fetchPartyDetails = function () {
            self.showList(false);
            self.partyDetails.partyDetailsFetched(false);
            PartyValidateModel.fetchDetails(self.partyId()).done(function (data) {
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
                    self.indirectedPartyId(data.parties[0].id.value);
                    self.fetchDetailsWithIndirectedValue();
                } else {
                    rootParams.baseModel.showMessages(null, [self.nls.errors.invalidInputProvided], "ERROR");
                }
            });
        };
        self.fetchDetailsWithIndirectedValue = function () {
            self.showList(false);
            self.partyDetails.partyDetailsFetched(false);
            PartyValidateModel.fetchDetailsWithIndirectedValue(self.indirectedPartyId()).done(function (data) {
                self.partyAdditionalDetails(data);
                self.partyDetails.partyId(data.party.id.value);
                self.partyDetails.partyIdDisplay(data.party.id.displayValue);
                self.partyDetails.partyName(data.party.personalDetails.fullName);
                self.partyDetails.partyFirstName(data.party.personalDetails.fullName);
                self.partyDetails.partyLastName(data.party.personalDetails.lastName);
                self.partyDetails.partyDetailsFetched(true);
                self.partyDetails.party.value(data.party.id.value);
                self.partyDetails.party.displayValue(data.party.id.displayValue);
                self.showPartyList(false);
            });
        };
        if (rootParams.partyDetails.partyId() !== null && rootParams.partyDetails.partyId() !== "" && typeof rootParams.partyDetails.partyId() === "string") {
            self.partyId(rootParams.partyDetails.partyId());
            self.indirectedPartyId(rootParams.partyDetails.party.value);
            self.fetchPartyDetails();
        }
        self.reset = function () {
            self.partyAdditionalDetails("");
            self.showList(false);
            self.partyName("reset");
            self.partyDetails.partyId("reset");
            self.partyDetails.partyIdDisplay("reset");
            self.partyDetails.partyName("reset");
            self.partyId("reset");
            self.partyId("");
            self.partyDetails.partyIdDisplay("");
            self.partyName("");
            self.partyDetails.partyName("");
            self.partyDetails.partyId("");
            self.partyDetails.partyDetailsFetched(false);
            self.partyDetails.party.value("");
            self.partyDetails.party.displayValue("");
           self.showPartyList(false);
           self.datasource = new oj.ArrayTableDataSource([]);
           self.partyDatasource = new oj.ArrayTableDataSource([]);
        };
        var partyDetailsSubscriptions = rootParams.partyDetails.partyId.subscribe(function () {
            if (rootParams.partyDetails.partyId() === "") {
                self.partyId(rootParams.partyDetails.partyId());
            }
        });
        self.dispose = function () {
            partyDetailsSubscriptions.dispose();
        };
        self.fetchPartyDetailsByName = function () {
            self.partyName(self.partyDetails.partyName());
            PartyValidateModel.fetchDetailsByName(self.partyDetails.partyName()).done(function (data) {
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
                    self.partyId(data.parties[0].value);
                    self.indirectedPartyId(data.parties[0].value);
                    self.fetchPartyDetails();
                } else {
                    rootParams.baseModel.showMessages(null, [self.nls.errors.invalidInputProvided], "ERROR");
                }
            });
        };
        self.fetchLinkageDetailForParty = function (data) {
            self.partyDetails.partyId(data.id);
            self.partyId(rootParams.partyDetails.partyId());
            self.indirectedPartyId(rootParams.partyDetails.partyId());
            self.partyDetails.partyName(data.partyName);
            self.fetchPartyDetails();
            self.partyDetails.partyDetailsFetched(true);
            self.showList(false);
        };
        self.onPartySelected = function (data, event) {
            if (!rootParams.baseModel.small()) {
                if (event.option === "currentRow") {
                    if ($.isArray(event.value)) {
                        self.goToMap(self.datasource[event.value[0].startIndex.row]);
                    } else {
                        self.goToMap(self.datasource.data[event.value.rowIndex]);
                    }
                }
            } else {
                self.goToMap(data);
            }
        };
        self.onPartyIdSelected = function (data, event) {
            if (!rootParams.baseModel.small()) {
                if (event.option === "currentRow") {
                    if ($.isArray(event.value)) {
                        self.goToMap(self.partyDatasource[event.value[0].startIndex.row]);
                    } else {
                        self.goToMap(self.partyDatasource.data[event.value.rowIndex]);
                    }
                }
            } else {
                self.goToMap(data);
            }
        };
        self.goToMap = function (data) {
            self.partyDetails.partyId(data.value);
            self.partyId(rootParams.partyDetails.partyId());
            self.indirectedPartyId(rootParams.partyDetails.partyId());
            self.partyDetails.partyName(data.partyName);
            self.fetchDetailsWithIndirectedValue();
            self.showList(false);
        };
        self.validateParty = function () {
            if (!self.partyId() && !self.partyName() && !self.partyDetails.partyName()) {
                rootParams.baseModel.showMessages(null, [self.nls.errors.idnamevalidation], "ERROR");
            }
            if (self.partyId()) {
                self.fetchPartyDetails();
            } else if (self.partyDetails.partyName()) {
                self.showPartyList(false);
                self.fetchPartyDetailsByName();
            } else if (self.partyId() === undefined && self.partyDetails.partyName() === null) {
                if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker()) && !rootParams.baseModel.showComponentValidationErrors(self.validationTrackerForName())) {
                  return false;
                }
            }
        };
        self.submitIfEnter = function (data, event) {
            if (event.keyCode === 13) {
                self.validateParty();
            }
        };
    };
});
