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
        self.roleName = ko.observable();
        self.roleDesc = ko.observable();
        self.childRoleName = ko.observable();
        self.childRoleDesc = ko.observable();
        self.datasource = new oj.ArrayTableDataSource([]);
        self.childAdded = ko.observable(true);
        self.childRoles = ko.observableArray();
        self.finalChildRoles = ko.observableArray();
        self.validationTrackerParent = ko.observable();
        self.validationTrackerChild = ko.observable();
        self.addChildRolesFlag = ko.observable(false);
        params.dashboard.headerName(self.nls.parent.header);
        self.childEnterpriseRole = {
            "childRoleName": ko.observable(),
            "childRoleDesc": ko.observable(),
            "action": ko.observable(true)
        };
        params.baseModel.registerElement("confirm-screen");
        if (self.createReviewData && self.createReviewData()) {
            self.roleName(self.createReviewData().enterpriseRoleName);
            self.roleDesc(self.createReviewData().enterpriseRoleDesc);
            if (self.createReviewData().listOfChildRoles && self.createReviewData().listOfChildRoles.length) {
                for (var i = 0; i < self.createReviewData().listOfChildRoles.length; i++) {
                    var child = {
                        childRoleName: self.createReviewData().listOfChildRoles[i].enterpriseRoleName,
                        childRoleDesc: self.createReviewData().listOfChildRoles[i].enterpriseRoleDesc,
                        action: false
                    };
                    self.childRoles.push(child);
                    self.finalChildRoles.push(child);
                    self.addChildRolesFlag(true);
                }
            }
        }
        params.baseModel.registerComponent("review-enterprise-role-create", "enterprise-role-management");
        params.baseModel.registerElement("action-header");
        self.addRow = function () {
            if (!params.baseModel.showComponentValidationErrors(self.validationTrackerChild())) {
                return;
            }
            self.childAdded(false);
            self.addChildRolesFlag(true);
            self.childEnterpriseRole.childRoleName = null;
            self.childEnterpriseRole.childRoleDesc = null;
            self.childEnterpriseRole.action = true;
            self.finalChildRoles().push(ko.toJS(self.childEnterpriseRole));
            self.childRoles.removeAll();
            ko.utils.arrayPushAll(self.childRoles(), self.finalChildRoles());
            self.datasource.reset(self.childRoles(), {});
            self.childAdded(true);
        };
        self.removeRow = function (data) {
            var i;
            self.childAdded(false);
            for (i = 0; i < self.childRoles().length; i++) {
                if (self.childRoles()[i].childRoleName === null) {
                    self.finalChildRoles.remove(self.childRoles()[i]);
                    break;
                }
            }
            if (data && data.childRoleName !== null) {
                for (var j = 0; i < self.childRoles().length; j++) {
                    if (self.childRoles()[i].childRoleName === data.childRoleName) {
                        self.finalChildRoles.remove(self.childRoles()[j]);
                        break;
                    }
                }
            }
            self.childRoles.removeAll();
            ko.utils.arrayPushAll(self.childRoles(), self.finalChildRoles());
            if (self.childRoles() === undefined) {
                self.childRoles = ko.observableArray();
            }
            self.datasource.reset(self.childRoles(), {});
            if (self.childRoles().length === 0) {
                self.addChildRolesFlag(false);
            }
            self.childAdded(false);
            self.childAdded(true);
        };
        self.editChild = function (data) {
            self.childAdded(false);
            for (var i = 0; i < self.childRoles().length; i++) {
                if (self.childRoles()[i].childRoleName === data.childRoleName) {
                    self.childRoles()[i].action = true;
                    self.finalChildRoles.remove(self.childRoles()[i]);
                    break;
                }
            }
            self.datasource.reset(self.childRoles(), {});
            self.childAdded(true);
        };
        self.addChild = function (data) {
            if (!params.baseModel.showComponentValidationErrors(self.validationTrackerChild())) {
                return;
            }
            self.childAdded(false);
            self.childEnterpriseRole.childRoleName = data.childRoleName;
            self.childEnterpriseRole.childRoleDesc = data.childRoleDesc;
            self.childEnterpriseRole.action = false;
            self.finalChildRoles().push(ko.toJS(self.childEnterpriseRole));
            self.childRoles.removeAll();
            ko.utils.arrayPushAll(self.childRoles(), self.finalChildRoles());
            self.datasource.reset(self.childRoles(), {});
            self.removeRow();
            self.childAdded(true);
        };
        self.removeChild = function (data) {
            self.childAdded(false);
            for (var i = 0; i < self.childRoles().length; i++) {
                if (self.childRoles()[i].childRoleName === data.childRoleName) {
                    self.finalChildRoles.remove(self.childRoles()[i]);
                    break;
                }
            }
            self.childRoles.removeAll();
            ko.utils.arrayPushAll(self.childRoles(), self.finalChildRoles());
            if (self.childRoles() === undefined) {
                self.childRoles = ko.observableArray();
            }
            if (self.childRoles().length === 0) {
                self.addChildRolesFlag(false);
            }
            self.datasource.reset(self.childRoles(), {});
            self.childAdded(true);
        };
        self.save = function () {
            if (!params.baseModel.showComponentValidationErrors(self.validationTrackerParent())) {
                return;
            }
            self.removeRow();
            self.savePayload = ko.observable();
            self.chidlRoles = ko.observableArray();
            for (var j = 0; j < self.finalChildRoles().length; j++) {
                var childEnt = {
                    enterpriseRoleId: self.childRoles()[j].childRoleName,
                    enterpriseRoleName: self.childRoles()[j].childRoleName,
                    enterpriseRoleDesc: self.childRoles()[j].childRoleDesc,
                    factoryShippedFlag: "N",
                    parent: self.roleName()
                };
                self.chidlRoles.push(childEnt);
            }
            var parentEnt = {
                enterpriseRoleId: self.roleName(),
                enterpriseRoleName: self.roleName(),
                enterpriseRoleDesc: self.roleDesc(),
                factoryShippedFlag: "N",
                listOfChildRoles: self.chidlRoles()
            };
            self.savePayload(parentEnt);
            params.dashboard.loadComponent("review-enterprise-role-create", { data: self.savePayload() }, self);
        };
        self.create = function () {
            EnterpriseRoleModel.createEnterpriseRole(ko.toJSON(self.savePayload)).done(function (data, status, jqXhr) {
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.nls.headers.transactionName
                }, self);
            });
        };
        self.datasource = new oj.ArrayTableDataSource(self.childRoles(), {});
    };
});