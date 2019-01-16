define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/pending-approvals-report",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox"
], function (oj, ko, $, pendingApprovalsModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle.pendingApprovals;
        self.validationTracker = rootParams.validationTracker;
        self.partyDetailsFetched = ko.observable(false);
        self.partyId = ko.observable();
        self.partyName = ko.observable();
        pendingApprovalsModel.fetchMe().done(function (data) {
            if (data.userProfile.partyId.value) {
                self.partyId(data.userProfile.partyId.displayValue);
                pendingApprovalsModel.fetchMeWithParty().done(function (dataName) {
                    self.partyName(dataName.party.personalDetails.fullName);
                    self.partyDetailsFetched(true);
                });
            }
        });
    };
});