define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/pending-for-action-mail-box",
    "framework/js/constants/constants"
], function (oj, ko, $, MiniMailboxModel, resourceBundle, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        var unreadNotificationsCountCheck, unreadAlertsCountCheck, unreadMailsCountCheck;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.userSegment = Constants.userSegment;
        self.totalCountVar = 0;
        self.unreadNotificationCount = ko.observable();
        self.unreadAlertCount = ko.observable();
        self.unreadmailCount = ko.observable();
        self.totalCount = ko.observable(0);
        self.countLoaded = ko.observable(false);
        self.loadImage = ko.observable("dashboard/new-mail.svg");
        rootParams.baseModel.registerComponent("message-base", "mailbox");
        self.formatMailsForCustomerID = function (mails) {
            unreadMailsCountCheck = 0;
            if (mails) {
                for (var i = 0; i < mails.length; i++) {
                    var MessageUserMappings = mails[i].messageUserMappings;
                    for (var j = 0; j < MessageUserMappings.length; j++) {
                        var messageUserMapping = MessageUserMappings[j];
                        if (rootParams.dashboard.userData && messageUserMapping.userId === rootParams.dashboard.userData.userProfile.userName) {
                            if (messageUserMapping.status === "U") {
                                unreadMailsCountCheck++;
                            }
                        }
                    }
                }
            }
            return mails;
        };
        self.formatAlertForCustomerID = function (alerts) {
            unreadAlertsCountCheck = 0;
            if (alerts) {
                for (var i = 0; i < alerts.length; i++) {
                    var MessageUserMappings = alerts[i].messageUserMappings;
                    for (var j = 0; j < MessageUserMappings.length; j++) {
                        var messageUserMapping = MessageUserMappings[j];
                        if (rootParams.dashboard.userData && messageUserMapping.userId === rootParams.dashboard.userData.userProfile.userName) {
                            if (messageUserMapping.status === "U") {
                                unreadAlertsCountCheck++;
                            }
                        }
                    }
                }
            }
            return alerts;
        };
        self.formatNotificationsForCustomerID = function (messageUserMappings) {
            unreadNotificationsCountCheck = 0;
            for (var j = 0; j < messageUserMappings.length; j++) {
                var MessageUserMapping = messageUserMappings[j];
                if (rootParams.dashboard.userData && MessageUserMapping.userId === rootParams.dashboard.userData.userProfile.userName) {
                    if (MessageUserMapping.status === "U") {
                        unreadNotificationsCountCheck++;
                    }
                }
            }
            return messageUserMappings;
        };

        function setData(mailData, alertData, notificationData) {
            self.formatMailsForCustomerID(mailData.mails, "F");
            self.unreadmailCount(unreadMailsCountCheck);
            self.formatAlertForCustomerID(alertData.alertDTOs);
            self.unreadAlertCount(unreadAlertsCountCheck);
            self.formatNotificationsForCustomerID(notificationData.mailerUserMapDTOs);
            self.unreadNotificationCount(unreadNotificationsCountCheck);
            self.totalCount(unreadMailsCountCheck + unreadAlertsCountCheck + unreadNotificationsCountCheck);
        }

        function getData() {
                $.when(MiniMailboxModel.getMails(), MiniMailboxModel.getAlerts(), MiniMailboxModel.getNotifications()).then(function (mailData, alertData, notificationData) {
                    setData(mailData, alertData, notificationData);
                });
        }
        getData();
        self.countLoaded(true);
        self.loadMailBoxComponent = function (token, data) {
            if (token === "T") {
                rootParams.dashboard.loadComponent("message-base", {
                    "miniMailboxParamsObj": {
                        tab: "Mails",
                        data: data
                    },
                    "selectedMailBoxComponent": "Mails"
                }, self);
            } else if (token === "F") {
                rootParams.dashboard.loadComponent("message-base", {
                    "miniMailboxParamsObj": null,
                    "selectedMailBoxComponent": "Mails"
                }, self);
            }
        };
    };
});
