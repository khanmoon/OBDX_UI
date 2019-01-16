define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",

    "ojL10n!resources/nls/user-group-subject-map",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojpopup"
], function (oj, ko, $, BaseLogger, UserGroupSubjectBaseModel, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerComponent("mapping-search", "usergroup-subject-map");
        rootParams.baseModel.registerComponent("mapping-create", "usergroup-subject-map");
        rootParams.baseModel.registerComponent("list-mail-categories", "usergroup-subject-map");
        rootParams.baseModel.registerComponent("mapping-update", "usergroup-subject-map");
        self.approval = ko.observable(false);
        rootParams.baseModel.registerElement("action-header");
        rootParams.dashboard.headerName(self.nls.pageTitle.userGroupSubjectMap);
        self.mailCategoryDTOs = ko.observableArray();
        self.updateMode = ko.observable(false);
        self.groupCodeEnums = ko.observableArray();
        self.selectedUserGroupId = ko.observable();
        self.groupCodeEnumsLoaded = ko.observable(false);
        self.listUserGroups = function () {
            UserGroupSubjectBaseModel.fetchUserGroupList().done(function (userGroupData) {
                ko.utils.arrayForEach(userGroupData.userGroupDTOs, function (item) {
                    self.groupCodeObject = {
                        "groupCodeId": "",
                        "groupCodeName": "",
                        "groupCodeDescription": ""
                    };
                    self.groupCodeObject.groupCodeId = item.id;
                    self.groupCodeObject.groupCodeName = item.name + "-" + item.description;
                    self.groupCodeObject.groupCodeDescription = item.description;
                    self.groupCodeEnums.push(self.groupCodeObject);
                });
                self.groupCodeEnumsLoaded(true);
                rootParams.dashboard.loadComponent("mapping-create", {}, self);
            });
        };
    };
});