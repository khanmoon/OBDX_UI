define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/enterprise-role-create",
    "ojs/ojinputtext",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, EnterpriseRoleModel, resourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;
        self.createReviewData = ko.observable();
        self.createReviewData(ko.toJS(self.params.data));
        self.childdatasource = new oj.ArrayTableDataSource([]);
        self.roleDataLoaded = ko.observable(false);
        params.dashboard.headerName(self.nls.parent.header);
        self.addChildRolesFlag = ko.observable(false);
        if (self.createReviewData().listOfChildRoles && self.createReviewData().listOfChildRoles.length !== 0) {
            self.childdatasource.reset(self.createReviewData().listOfChildRoles, { idAttribute: "enterpriseRoleName" });
            self.addChildRolesFlag(true);
        }
        self.roleDataLoaded(true);
        self.edit = function () {
            params.dashboard.loadComponent("enterprise-role-update", {}, self);
        };
    };
});