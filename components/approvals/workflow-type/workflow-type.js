define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "ojL10n!resources/nls/approvals",
    "./model",
    "framework/js/constants/constants",
    "ojs/ojinputtext",
    "ojs/ojnavigationlist",
    "ojs/ojradioset"
], function (oj, ko, $, BaseLogger, resourceBundle, Model) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerElement("nav-bar");
        rootParams.baseModel.registerComponent("workflow", "approvals");
        rootParams.baseModel.registerComponent("workflow-admin", "admin-approvals");
        rootParams.baseModel.registerElement("modal-window");
        self.isAdmin = ko.observable();
        rootParams.dashboard.headerName(self.nls.pageTitle.approvals);
        self.partyDetailsFromApprovalNavBar = {};
        self.showChoicePopup = ko.observable(true);
        self.approvalUser = ko.observable();
        self.workflowType = ko.observable();
        self.menuSelection = ko.observable();
        self.party = ko.observable();
        self.mode = ko.observable("APPROVALREVIEW");
        Model.fetchMe().done(function (partyId) {
            if (partyId.userProfile.partyId.displayValue) {
                self.partyDetailsFromApprovalNavBar.value = partyId.userProfile.partyId.value;
                self.partyDetailsFromApprovalNavBar.displayValue = partyId.userProfile.partyId.displayValue;
                self.loadCorporateComponent();
                self.isAdmin(false);
            } else {
                self.isAdmin(true);
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
        self.workflowTypeSelected = function () {
            if(self.workflowType() === "Admin User") {
                self.approvalUser("AdminUser");
                self.keepCheck(false);
                if (targetComponent === "Workflow") {
                    rootParams.dashboard.loadComponent("workflow-admin", {}, self);
                }
            } else if(self.workflowType() === "Corporate User") {
                self.loadCorporateComponent();
            }
        };
        self.loadCorporateComponent = function () {
            self.approvalUser("CorporateUser");
            self.keepCheck(false);
            if (targetComponent === "Workflow")
                rootParams.dashboard.loadComponent("workflow", {}, self);
        };
    };
});