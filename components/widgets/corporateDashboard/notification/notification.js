define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/mini-mailbox",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, MiniMailboxBaseModel, resourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        var unreadNotificationsCountCheck;
        self.unreadNotificationCount = ko.observable();
        self.unreadmailCount = ko.observable();
        self.unreadAlertCount = ko.observable();
        self.totalUnreadNotification = ko.observable();
        self.isUnreadNotification = ko.observable(false);
        self.nls = resourceBundle;
        params.baseModel.registerComponent("message-base", "mailbox");
        params.baseModel.registerElement("date-time");
        self.notificationsArray = ko.observableArray();
        self.notificationDataSource = new oj.ArrayTableDataSource(self.notificationsArray, {
            idAttribute: "mapId"
        });
        self.formatNotificationsForCustomerID = function (messageUserMappings) {
            unreadNotificationsCountCheck = 0;
            for (var j = 0; j < messageUserMappings.length; j++) {
                var MessageUserMapping = messageUserMappings[j];
                if (params.dashboard.userData && MessageUserMapping.userId === params.dashboard.userData.userProfile.userName) {
                    if (MessageUserMapping.status === "U") {
                        unreadNotificationsCountCheck++;
                    }
                }
            }
            return messageUserMappings;
        };

        function setNotification(notificationData) {
            var notificationsRecord = self.formatNotificationsForCustomerID(notificationData.mailerUserMapDTOs);
            self.unreadNotificationCount(unreadNotificationsCountCheck);
            var x;
            for (x = 0; x < notificationsRecord.length; x++) {
                if (notificationsRecord[x].status === "U") {
                    self.notificationsArray.push(notificationsRecord[x]);
                }
                if (self.notificationsArray().length === 4) {
                    break;
                }
            }
            if (self.unreadNotificationCount()) {
                self.isUnreadNotification(true);
            }
        }

        function setMailCount(data) {
            self.unreadmailCount(data.summary.items[0].unReadCount);
            self.unreadAlertCount(data.summary.items[1].unReadCount);
            self.unreadNotificationCount(data.summary.items[2].unReadCount);
            self.totalUnreadNotification = self.unreadmailCount() + self.unreadAlertCount() + self.unreadNotificationCount();
        }

        function fetchData() {
                MiniMailboxBaseModel.getNotifications().then(function (notificationData) {
                    setNotification(notificationData);
                });
                MiniMailboxBaseModel.getMailCount().then(function (data) {
                    setMailCount(data);
                });
        }
        fetchData();
        self.loadMailBoxComponent = function (token, data) {
            if (token === "T") {
                params.dashboard.loadComponent("message-base", {
                    "miniMailboxParamsObj": {
                        tab: "Notifications",
                        data: data
                    },
                    "selectedMailBoxComponent": "Notifications"
                }, self);
            } else if (token === "F") {
                params.dashboard.loadComponent("message-base", {
                    "miniMailboxParamsObj": null,
                    "selectedMailBoxComponent": "Notifications"
                }, self);
            }
        };
    };
});
