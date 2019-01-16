define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "./model",
    "ojL10n!resources/nls/mailbox",
    "ojs/ojinputtext",
    "ojs/ojnavigationlist"
], function (oj, ko, $, BaseLogger, MiniMailboxBaseModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.nls = resourceBundle;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("mailbox-base", "mailbox");
        rootParams.baseModel.registerComponent("alert-list", "mailbox");
        rootParams.baseModel.registerComponent("notification-list", "mailbox");
        rootParams.baseModel.registerElement("nav-bar");
        self.countUpdated = ko.observable(true);
        self.menuSelection = ko.observable();
        self.showNavBar = ko.observable(false);
        self.menuOptions = ko.observable();
        var unreadAlertCountSubscription, unreadNotificationCountSubscription, unreadmailCountSubscription;
        $.when(MiniMailboxBaseModel.getMails(), MiniMailboxBaseModel.getAlerts(), MiniMailboxBaseModel.getNotifications()).done(function () {
            self.alertTab = ko.observable(self.unreadAlertCount() ? rootParams.baseModel.format(self.nls.mailbox.alerts.alertTab, { alertUnreadCount: self.unreadAlertCount() }) : self.nls.mailbox.headers.alerts);
            self.mailTab = ko.observable(self.unreadmailCount() ? rootParams.baseModel.format(self.nls.mailbox.alerts.mailTab, { mailUnreadCount: self.unreadmailCount() }) : self.nls.mailbox.headers.mails);
            self.notificationTab = ko.observable(self.unreadNotificationCount() ? rootParams.baseModel.format(self.nls.mailbox.alerts.notificationTab, { notificationUnreadCount: self.unreadNotificationCount() }) : self.nls.mailbox.headers.notifications);
            rootParams.baseModel.registerElement("nav-bar");
            self.menuOptions = ko.observable([
                {
                    id: self.nls.mailbox.headers.mails,
                    label: self.mailTab(),
                    disabled: false
                },
                {
                    id: self.nls.mailbox.headers.alerts,
                    label: self.alertTab(),
                    disabled: false
                },
                {
                    id: self.nls.mailbox.headers.notifications,
                    label: self.notificationTab(),
                    disabled: false
                }
            ]);
            self.menuSelection(self.nls.mailbox.headers.notifications);
            unreadAlertCountSubscription = rootParams.mailbox.unreadAlertCount.subscribe(function () {
                self.showNavBar(false);
                self.alertTab(rootParams.mailbox.unreadAlertCount() !== 0 ? rootParams.baseModel.format(self.nls.mailbox.alerts.alertTab, { alertUnreadCount: rootParams.mailbox.unreadAlertCount() }) : self.nls.mailbox.headers.alerts);
                self.mailTab(rootParams.mailbox.unreadmailCount() !== 0 ? rootParams.baseModel.format(self.nls.mailbox.alerts.mailTab, { mailUnreadCount: rootParams.mailbox.unreadmailCount() }) : self.nls.mailbox.headers.mails);
                self.notificationTab(rootParams.mailbox.unreadNotificationCount() !== 0 ? rootParams.baseModel.format(self.nls.mailbox.alerts.notificationTab, { notificationUnreadCount: rootParams.mailbox.unreadNotificationCount() }) : self.nls.mailbox.headers.notifications);
                self.menuSelection(self.menuOptions()[1].id);
                self.menuOptions()[0].label = self.mailTab();
                self.menuOptions()[1].label = self.alertTab();
                self.menuOptions()[2].label = self.notificationTab();
                ko.tasks.runEarly();
                self.totalUnreadNotification = self.unreadmailCount() + self.unreadAlertCount() + self.unreadNotificationCount();
                self.showNavBar(true);
            });
            unreadNotificationCountSubscription = rootParams.mailbox.unreadNotificationCount.subscribe(function () {
                self.showNavBar(false);
                self.notificationTab(rootParams.mailbox.unreadNotificationCount() !== 0 ? rootParams.baseModel.format(self.nls.mailbox.alerts.notificationTab, { notificationUnreadCount: rootParams.mailbox.unreadNotificationCount() }) : self.nls.mailbox.headers.notifications);
                self.alertTab(rootParams.mailbox.unreadAlertCount() !== 0 ? rootParams.baseModel.format(self.nls.mailbox.alerts.alertTab, { alertUnreadCount: rootParams.mailbox.unreadAlertCount() }) : self.nls.mailbox.headers.alerts);
                self.mailTab(rootParams.mailbox.unreadmailCount() !== 0 ? rootParams.baseModel.format(self.nls.mailbox.alerts.mailTab, { mailUnreadCount: rootParams.mailbox.unreadmailCount() }) : self.nls.mailbox.headers.mails);
                self.menuSelection(self.menuOptions()[2].id);
                self.menuOptions()[0].label = self.mailTab();
                self.menuOptions()[1].label = self.alertTab();
                self.menuOptions()[2].label = self.notificationTab();
                ko.tasks.runEarly();
                self.totalUnreadNotification = self.unreadmailCount() + self.unreadAlertCount() + self.unreadNotificationCount();
                self.showNavBar(true);
            });
            unreadmailCountSubscription = rootParams.mailbox.unreadmailCount.subscribe(function () {
                self.showNavBar(false);
                self.notificationTab(rootParams.mailbox.unreadNotificationCount() !== 0 ? rootParams.baseModel.format(self.nls.mailbox.alerts.notificationTab, { notificationUnreadCount: rootParams.mailbox.unreadNotificationCount() }) : self.nls.mailbox.headers.notifications);
                self.alertTab(rootParams.mailbox.unreadAlertCount() !== 0 ? rootParams.baseModel.format(self.nls.mailbox.alerts.alertTab, { alertUnreadCount: rootParams.mailbox.unreadAlertCount() }) : self.nls.mailbox.headers.alerts);
                self.mailTab(rootParams.mailbox.unreadmailCount() !== 0 ? rootParams.baseModel.format(self.nls.mailbox.alerts.mailTab, { mailUnreadCount: rootParams.mailbox.unreadmailCount() }) : self.nls.mailbox.headers.mails);
                self.menuSelection(self.menuOptions()[0].id);
                self.menuOptions()[0].label = self.mailTab();
                self.menuOptions()[1].label = self.alertTab();
                self.menuOptions()[2].label = self.notificationTab();
                self.totalUnreadNotification = self.unreadmailCount() + self.unreadAlertCount() + self.unreadNotificationCount();
                ko.tasks.runEarly();
                self.showNavBar(true);
            });
            if (self.menuOptions) {
                if (self.selectedMailBoxComponent().toUpperCase() === "MAILS") {
                    self.menuSelection(self.menuOptions()[0].id);
                } else if (self.selectedMailBoxComponent().toUpperCase() === "ALERTS") {
                    self.menuSelection(self.menuOptions()[1].id);
                } else {
                    self.menuSelection(self.menuOptions()[2].id);
                }
            }
            self.uiOptions = {
                "menuFloat": "right",
                "fullWidth": false,
                "defaultOption": self.menuSelection
            };
        });
        self.menuSelection.subscribe(function (newValue) {
            if (newValue.toUpperCase() === "MAILS") {
                self.selectedMailBoxComponent(self.nls.mailbox.headers.mails);
                self.setComponentId("mailbox-base");
            } else if (newValue.toUpperCase() === "ALERTS") {
                self.selectedMailBoxComponent(self.nls.mailbox.headers.alerts);
                self.setComponentId("alert-list");
            } else if (newValue.toUpperCase() === "NOTIFICATIONS") {
                self.selectedMailBoxComponent(self.nls.mailbox.headers.notifications);
                self.setComponentId("notification-list");
            }
            self.showNavBar(false);
            self.showNavBar(true);
        });
        self.dispose = function () {
            unreadNotificationCountSubscription.dispose();
            unreadmailCountSubscription.dispose();
            unreadAlertCountSubscription.dispose();
        };
    };
});
