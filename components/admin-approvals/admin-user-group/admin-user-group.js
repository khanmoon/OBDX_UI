define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",

    "framework/js/constants/constants",
    "ojL10n!resources/nls/admin-user-group",
    "ojs/ojinputtext",
    "ojs/ojradioset"
], function (oj, ko, $, BaseLogger, UserGroupModel, Constants, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.userGroup.adminUserGroupDetails);
        rootParams.baseModel.registerComponent("admin-user-group-list", "admin-approvals");
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerComponent("admin-user-group-view", "admin-approvals");
        self.actionHeaderheading = ko.observable(self.nls.headers.adminUserGroupMaintenance);
        self.createWorkflow = ko.observable();
        self.searchWorkflow = ko.observable();
        self.userGroupDTOs = ko.observable();
        self.validationTracker = ko.observable();
        self.validationTrackers = ko.observable();
        var getNewKoModel = function () {
            var KoModel = UserGroupModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.groupDetails = self.rootModelInstance().groupDetails;
        self.fetchGroupDetailsCode = function () {
            if (self.groupDetails.userGroupName() === "" && self.groupDetails.description() === "") {
                rootParams.baseModel.showMessages(null, [self.nls.info.noDescription], "ERROR");
                return;
            }
            self.groupDetails.groupDetailsFetched(false);
            UserGroupModel.fetchDetails(self.groupDetails.userGroupType(), self.groupDetails.partyId(), self.groupDetails.userGroupName(), self.groupDetails.description()).done(function (data) {
                self.groupDetails.userGroupDTOs(data.userGroupDTOs);
                if (data.userGroupDTOs.length > 0) {
                    self.groupDetails.userGroupDTOs(data.userGroupDTOs);
                    self.groupDetails.groupDetailsFetched(true);
                    rootParams.dashboard.loadComponent("admin-user-group-list", {}, self);
                } else {
                    rootParams.baseModel.showMessages(null, [self.nls.info.noRecordFound], "INFO");
                }
            });
        };
        self.clear = function () {
            self.groupDetails.userGroupName("");
            self.groupDetails.description("");
        };
        self.createNew = function () {
            self.mode = "CREATE";
            var data = { mode: "CREATE" };
            rootParams.dashboard.loadComponent("admin-user-group-view", data, self);
        };
        self.cancel = function () {
            rootParams.dashboard.openDashBoard();
        };
    };
});