define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/admin-user-group",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, UserGroupListModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.dataLoaded = ko.observable(false);
        self.userGroupList = ko.observableArray();
        self.datasource = {};
        self.mode = "";
        rootParams.dashboard.headerName(self.nls.userGroup.adminUserGroupDetails);
        self.validationTracker = ko.observable();
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerComponent("admin-user-group-view", "admin-approvals");
        rootParams.baseModel.registerComponent("admin-user-group", "admin-approvals");
        var getNewKoModel = function () {
            var KoModel = UserGroupListModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = ko.observable(getNewKoModel());

        self.createNew = function () {
            self.mode = "CREATE";
            var data = { mode: "CREATE" };
            rootParams.dashboard.loadComponent("admin-user-group-view", data, self);
        };
        if (self.groupDetails.groupDetailsFetched()) {
            if (self.groupDetails.userGroupDTOs().length > 0) {
                var partyData = $.map(self.groupDetails.userGroupDTOs(), function (userData) {
                    userData.usercount = userData.users.length;
                    userData.partyDetails = self.partyDetails;
                    userData.mode = "";
                    return userData;
                });
                if (partyData.length > 0) {
                    self.datasource = new oj.ArrayTableDataSource(partyData, { idAttribute: "name" });
                    self.dataLoaded(true);
                }
            } else {
                rootParams.baseModel.showMessages(null, [self.nls.info.noRecordFound], "INFO");
            }
        }
        self.onUserGroupSelected = function (data) {
            data.mode = "VIEW";
            self.mode = "VIEW";
            rootParams.dashboard.loadComponent("admin-user-group-view", data, self);
        };
        self.goToMap = function (data) {
            rootParams.dashboard.loadComponent("admin-user-group-view", data, self);
        };
        self.back = function () {
            history.back();
        };
        self.cancel = function () {
            rootParams.dashboard.openDashBoard();
        };
    };
});