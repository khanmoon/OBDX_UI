define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/enterprise-role",
    "ojs/ojinputtext",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, EnterpriseRoleModel, resourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.header);
        params.baseModel.registerElement("action-header");
        self.childdatasource = new oj.ArrayTableDataSource([]);
        self.roleFullData = ko.observable();
        self.addChildRolesFlag = ko.observable(false);
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("enterprise-role-update", "enterprise-role-management");
        self.roleDataLoaded = ko.observable(false);
        self.factoryShipped = ko.observable(false);
        EnterpriseRoleModel.fetchRoleDetails(params.rootModel.params.data.enterpriseRoleName).done(function (data) {
            self.roleFullData(data.enterpriseRoleDTO);
            if (data.enterpriseRoleDTO.factoryShippedFlag === "N") {
                self.factoryShipped(true);
            }
            self.createReviewData = ko.observable();
            self.createReviewData(data.enterpriseRoleDTO);
            if (data.enterpriseRoleDTO.listOfChildRoles && data.enterpriseRoleDTO.listOfChildRoles.length !== 0) {
                self.childdatasource.reset(data.enterpriseRoleDTO.listOfChildRoles, { idAttribute: "enterpriseRoleName" });
                self.addChildRolesFlag(true);
            }
            self.roleDataLoaded(true);
            self.childdatasource.data = data.enterpriseRoleDTO.listOfChildRoles;
        });
        self.edit = function () {
            params.dashboard.loadComponent("enterprise-role-update", { createData: self.createReviewData() }, self);
        };
        self.goBack = function () {
            self.createReviewData = ko.observable();
            params.dashboard.loadComponent("enterprise-role-search", {}, self);
        };
        self.delete = function () {
            $("#deleteConfirmationModal").trigger("openModal");
        };
        self.closeModal = function(){
          $("#deleteConfirmationModal").hide();
        };
        self.deleteRole = function () {
            self.closeModal();
            EnterpriseRoleModel.deleteRole(params.rootModel.params.data.enterpriseRoleName).done(function (data, status, jqXhr) {
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.nls.transactionName
                }, self);
            });
        };
    };
});
