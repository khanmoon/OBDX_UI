define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/user-creation-report",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox"
], function(oj, ko, $, userCreationModel, resourceBundle) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle.userCreation;
        self.validationTracker = rootParams.validationTracker;
        self.isEnterpriseRolesLoaded = ko.observable(false);
        self.enterpriseRoles = ko.observableArray();
        userCreationModel.fetchEnumeration().done(function(data) {
            self.enterpriseRoles(data.enterpriseRoleDTOs);
            self.isEnterpriseRolesLoaded(true);
        });
        $("#fromScheduledDate").val(self.today());
        $("#toScheduledDate").val(self.today()+1);

        self.userSegmentSelected = function(event) {
            if (event.detail.value) {
                $("#userType").val(event.detail.value);
            }
        };

    };
});