define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/party-param-report",
    "framework/js/constants/constants",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox"
], function (oj, ko, $, partyParamModel, resourceBundle, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle.partyParam;
        self.validationTracker = rootParams.validationTracker;
        self.partyDetailsFetched = ko.observable(false);
        self.partyId = ko.observable();
        self.partyName = ko.observable();
        self.userType = ko.observable();
        self.userType(Constants.userSegment);
        partyParamModel.fetchMe().done(function (data) {
            if (data.userProfile.partyId.value) {
                self.partyId(data.userProfile.partyId.displayValue);
                partyParamModel.fetchMeWithParty().done(function (dataName) {
                    self.partyName(dataName.party.personalDetails.fullName);
                    self.partyDetailsFetched(true);
                });
            }
        });
    };
});