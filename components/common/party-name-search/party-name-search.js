define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",

    "framework/js/constants/constants",
    "ojL10n!resources/nls/party-name-search",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojtable",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation"
], function (oj, ko, $, BaseLogger, SearchPartyNameModel, constants, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.showList = ko.observable(false);
        self.partyName = ko.observable();
        self.validationTracker = ko.observable();
        self.datasource = new oj.ArrayTableDataSource([]);
        rootParams.baseModel.registerElement("action-header");
        self.partySelected = function (data) {
            self.partyId(data.displayValue);
            $("#partySearch").hide();
            self.partyName("reset");
            self.partyName("");
            self.showList(false);
        };
        self.resetParty = function () {
            self.partyName("reset");
            self.partyId("reset");
            self.partyName("");
            self.partyId("");
            self.showList(false);
        };
        self.fetchPartyDetailsByName = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.showList(false);
            SearchPartyNameModel.fetchDetailsByName(self.partyName()).done(function (data) {
                var partyList;
                partyList = $.map(data.parties, function (party) {
                    party.partyName = party.personalDetails.firstName;
                    party.value = party.id.value;
                    party.displayValue = party.id.displayValue;
                    return party;
                });
                self.datasource.reset(partyList, { idAttribute: "id" });
                self.datasource.data = partyList;
                if (data.parties.length > 0) {
                    self.showList(true);
                } else {
                    rootParams.baseModel.showMessages(null, [self.nls.error.invalidInputProvided], "ERROR");
                }
            });
        };
        self.submitIfEnter = function (data, event) {
            if (event.keyCode === 13) {
                self.showList(false);
                self.fetchPartyDetailsByName();
            }
        };
    };
});