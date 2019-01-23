define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/side-menu",
    "ojs/ojbutton"
], function(oj, ko, $, ResourceBundle) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.selectedSideMenuItem = ko.observable();
        self.menuSelectionForSideMenu = ko.observable();
        self.refreshSideMenuContent = ko.observable(true);
        rootParams.dashboard.headerName(self.resource.header);
        if (!rootParams.baseModel.small()) {
            self.selectedSideMenuItem("MyProfile");
            self.menuSelectionForSideMenu("profile");
        }
        self.sideMenuList = [{
            id: "MyProfile",
            component: "profile",
            module: "base-components"
        }, {
            id: "primaryAccount",
            component: "sms-primary-account",
            module: "sms-banking"
        }, {
            id: "alerts",
            component: "alerts-list",
            module: "alerts"
        }, {
            id: "thirdPartyApps",
            component: "third-party-consents",
            module: "third-party-consents"
        }, {
            id: "securityAndLogin",
            component: "security-menu",
            module: "security"
        }, {
            id: "settings",
            component: "generic-settings",
            module: "security"
        }];

        self.selectedSideMenuItem.subscribe(function(newValue) {
            var selectedItem = {};
            selectedItem = self.sideMenuList.filter(function(item) {
                return item.id === newValue;
            })[0];
            rootParams.baseModel.registerComponent(selectedItem.component, selectedItem.module);
            if (!rootParams.baseModel.small()) {
                self.refreshSideMenuContent(false);
                ko.tasks.runEarly();
                self.showDetailParams = selectedItem.data || {};
                self.menuSelectionForSideMenu(selectedItem.component);
                self.refreshSideMenuContent(true);
            } else {
                rootParams.dashboard.loadComponent(selectedItem.component, selectedItem.data || {}, self);
            }
        });

    };
});