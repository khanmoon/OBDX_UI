define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/enterprise-role",
    "ojs/ojinputtext",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation"
], function (oj, ko, $, EnterpriseRoleModel, resourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        self.roleName = ko.observable();
        self.roleDesc = ko.observable();
        self.datasource = new oj.ArrayTableDataSource([]);
        self.nls = resourceBundle;
        self.showList = ko.observable(false);
        ko.utils.extend(self, params.rootModel);
        self.validationTracker = ko.observable();
        params.dashboard.headerName(self.nls.header);
        params.baseModel.registerComponent("enterprise-role-read", "enterprise-role-management");
        params.baseModel.registerComponent("enterprise-role-create", "enterprise-role-management");
        self.create = function () {
            params.dashboard.loadComponent("enterprise-role-create", {}, self);
        };
        self.listRoles = function () {
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.showList(false);
            EnterpriseRoleModel.listRoles(self.roleName(), self.roleDesc()).done(function (data) {
                var roleSearchList;
                roleSearchList = $.map(data.enterpriseRoleDTOs, function (role) {


                    if (role.listOfChildRoles) {
                        var result = role.listOfChildRoles.map(function (val) {
                            return val.enterpriseRoleName;
                        }).join(", ");
                        role.listOfChildRoles = result;
                    }
                    return role;
                });
                self.datasource.reset(roleSearchList, { idAttribute: "enterpriseRoleName" });
                self.datasource.data = roleSearchList;
                self.showList(true);
            });
        };
        self.readRoleDetails = function (data) {
            params.dashboard.loadComponent("enterprise-role-read", { data: data }, self);
        };
        self.clear = function () {
            self.roleName("");
            self.roleDesc("");
            self.showList(false);
        };
    };
});