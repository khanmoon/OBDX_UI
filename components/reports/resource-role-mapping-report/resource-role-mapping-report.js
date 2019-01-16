define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/resource-role-mapping-report",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox"
], function (oj, ko, $, resourceRoleMappingModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle.resourceRoleMapping;
        self.validationTracker = rootParams.validationTracker;
        self.childRolesFetchedCount = ko.observable(0);
        self.parentRolesFetchedCount = ko.observable();
        self.roles = ko.observableArray();
        self.childParentRoleMap = {};
        resourceRoleMappingModel.fetchParentRole().done(function (data) {
            for (var j = 0; j < data.enterpriseRoleDTOs.length; j++) {
                self.fetchChildRoles(data.enterpriseRoleDTOs[j]);
            }
            self.parentRolesFetchedCount(data.enterpriseRoleDTOs.length);
        });
        self.fetchChildRoles = function (parentRole) {
            resourceRoleMappingModel.fetchChildRole(parentRole.enterpriseRoleId).done(function (data) {
                self.roles.push({
                    parentRole: parentRole.enterpriseRoleId,
                    parentRoleName: parentRole.enterpriseRoleName,
                    childRoles: data.applicationRoleDTOs
                });
                for (var i = 0; i < data.applicationRoleDTOs.length; i++) {
                    self.childParentRoleMap[data.applicationRoleDTOs[i].applicationRoleName] = parentRole;
                }
                self.childRolesFetchedCount(self.childRolesFetchedCount() + 1);
            });
        };
        self.onChildRoleSelected = function (event) {
            if (event.detail.value) {
                $("#parentRole").val(self.childParentRoleMap[event.detail.value].enterpriseRoleId);
                $("#parentRoleDisplayName").val(self.childParentRoleMap[event.detail.value].enterpriseRoleName);
            }
        };
    };
});
