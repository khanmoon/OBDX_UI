define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "ojL10n!resources/nls/approvals",
    "./model",
    "framework/js/constants/constants",
    "ojs/ojinputtext",
    "ojs/ojnavigationlist"
], function (oj, ko, $, BaseLogger, resourceBundle, ApprovalNavBarModel) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerElement("nav-bar");
        rootParams.baseModel.registerComponent("user-group", "approvals");
        rootParams.baseModel.registerComponent("rules", "approvals");
        rootParams.baseModel.registerComponent("workflow", "approvals");
        rootParams.baseModel.registerComponent("workflow-admin", "admin-approvals");
        rootParams.baseModel.registerComponent("admin-user-group", "admin-approvals");
        rootParams.baseModel.registerComponent("rules-admin", "admin-approvals");
        rootParams.baseModel.registerElement("modal-window");
        self.isAdmin = ko.observable();
        rootParams.dashboard.headerName(self.nls.pageTitle.approvals);
        self.partyDetailsFromApprovalNavBar = {};
        self.showChoicePopup = ko.observable(true);
        self.approvalUser = ko.observable();
        self.party = ko.observable();
        self.mode = ko.observable("APPROVALREVIEW");
        self.menuSelection = ko.observable("navLabels.userGroup");
        self.menuOptions = [
            "navLabels.userGroup",
            "navLabels.workflow",
            "navLabels.rule"
        ];
        self.uiOptions = {
            "menuFloat": "right",
            "fullWidth": false,
            "defaultOption": self.menuSelection
        };
        ApprovalNavBarModel.fetchMe().done(function (partyId) {
            if (partyId.userProfile.partyId.displayValue) {
                self.partyDetailsFromApprovalNavBar.value = partyId.userProfile.partyId.value;
                self.partyDetailsFromApprovalNavBar.displayValue = partyId.userProfile.partyId.displayValue;
                self.loadCorporateComponent();
                self.isAdmin(false);
            } else {
                self.isAdmin(true);
            }
        });
        self.menuSelection.subscribe(function (newValue) {
            if (newValue === "navLabels.workflow") {
                rootParams.dashboard.loadComponent("workflow", {}, self);
            } else if (newValue === "navLabels.rule") {
                rootParams.dashboard.loadComponent("rules", {}, self);
            } else if (newValue === "navLabels.userGroup") {
                rootParams.dashboard.loadComponent("user-group", {}, self);
            }
        });
        self.keepCheck = ko.observable(false);
        self.showModal = function () {
            $("#choicePopup").trigger("openModal");
            self.keepCheck(true);
        };
        var targetComponent = rootParams.rootModel.params.type;
        if (!targetComponent)
            rootParams.dashboard.openDashBoard();
        self.closeHandler = function () {
            rootParams.dashboard.openDashBoard();
        };
        self.loadAdminComponent = function () {
            self.approvalUser("AdminUser");
            self.keepCheck(false);
            if (targetComponent === "UserGroup") {
                rootParams.dashboard.loadComponent("admin-user-group", {}, self);
            } else if (targetComponent === "Workflow") {
                rootParams.dashboard.loadComponent("workflow-admin", {}, self);
            } else if (targetComponent === "Rules") {
                rootParams.dashboard.loadComponent("rules-admin", {}, self);
            }
        };
        self.loadCorporateComponent = function () {
            self.approvalUser("CorporateUser");
            self.keepCheck(false);
            if (targetComponent === "UserGroup")
                rootParams.dashboard.loadComponent("user-group", {}, self);
            else if (targetComponent === "Workflow")
                rootParams.dashboard.loadComponent("workflow", {}, self);
            else if (targetComponent === "Rules")
                rootParams.dashboard.loadComponent("rules", {}, self);
        };
    };
});