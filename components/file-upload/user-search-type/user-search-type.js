define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "ojL10n!resources/nls/user-search-type",
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
        rootParams.baseModel.registerComponent("user-search", "file-upload");
        rootParams.baseModel.registerComponent("user-search-admin", "file-upload");
        rootParams.baseModel.registerElement("modal-window");
        self.isAdmin = ko.observable();
        rootParams.dashboard.headerName(self.nls.user);
        self.approvalUser = ko.observable();
        self.mappingType = ko.observable();
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
        self.MappingTypeSelected = function () {
            if(self.mappingType() === "Admin User") {
                self.approvalUser("AdminUser");
                self.keepCheck(false);
                if (targetComponent === "User-Search") {
                    rootParams.dashboard.loadComponent("user-search-admin", {}, self);
                }
            } else if(self.mappingType() === "Corporate User") {
                self.loadCorporateComponent();
            }
        };
        self.loadCorporateComponent = function () {
            self.approvalUser("CorporateUser");
            self.keepCheck(false);
            if (targetComponent === "User-Search")
                rootParams.dashboard.loadComponent("user-search", {}, self);
        };
    };
});
