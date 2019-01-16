define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/mini-mailbox",
    "framework/js/constants/constants",
    "ojs/ojtoolbar",
    "ojs/ojlistview",
    "ojs/ojnavigationlist",
    "ojs/ojtabs",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource",
    "ojs/ojvalidation"
  ],
  function(oj, ko, $, MiniMailboxBaseModel, resourceBundle, Constants) {
    "use strict";
    return function(params) {
      var self = this;
      self.nls = resourceBundle;
      ko.utils.extend(self, params.rootModel);
      params.baseModel.registerElement("nav-bar");
      params.baseModel.registerComponent("message-base", "mailbox");
      self.nls = resourceBundle;
      self.menuSelection = ko.observable("miniMail");
      self.mailsArray = ko.observableArray();
      self.alertsArray = ko.observableArray();
      self.notificationsArray = ko.observableArray();
      self.mailDataSource = ko.observable();
      self.alertDatasource = ko.observable();
      self.notificationDataSource = ko.observable();
      self.showlist = ko.observable(false);
      self.menuselected = ko.observable(self.nls.mailbox.mails);
      self.selectedRecord = ko.observable();
      self.isAdminMailBox = ko.observable(false);
      self.showSeeMore = ko.observable(false);
      self.updateMailDatasource = ko.observable(false);
      self.updateAlertDatasource = ko.observable(false);
      self.updateNotificationDatasource = ko.observable(false);
      self.displayNavBar = ko.observable(false);
      self.datasource = ko.observable();
      self.miniMailboxParamsObj = ko.observable({
        tab: "",
        data: ""
      });
      if (Constants.userSegment === "ADMIN" || Constants.userSegment === "CORPADMIN") {
        self.isAdminMailBox(true);
      }
      self.getRootContext = function(data, $root) {
        $root.userInfoPromise.then(function() {
          ko.utils.extend(self, params.rootModel);
        });
      };
      self.formatMailsForCustomerID = function(mails, flag) {
        for (var i = 0; i < mails.length; i++) {
          var MessageUserMappings = mails[i].messageUserMappings;
          for (var j = 0; j < MessageUserMappings.length; j++) {
            var messageUserMapping = MessageUserMappings[j];
            if (messageUserMapping.msgFlag === flag) {
              if (flag === "F") {
                if (self.isAdminMailBox()) {
                  mails[i].userName = messageUserMapping.username;
                  mails[i].customerID = messageUserMapping.userId;
                } else {
                  mails[i].userName = messageUserMapping.userGroupName;
                  if (!messageUserMapping.userGroupName)
                    mails[i].senderName = messageUserMapping.username;
                  else {
                    mails[i].senderName = messageUserMapping.userGroupName;
                  }
                  mails[i].customerID = messageUserMapping.userId;
                }
              }
            }
            if (self.isAdminMailBox() && flag === "T") {
              if (messageUserMapping.msgFlag === flag && !messageUserMapping.userGroupName) {
                mails[i].customerID = messageUserMapping.userId;
                mails[i].userName = messageUserMapping.username;
              }
            }
            if (params.dashboard.userData && messageUserMapping.userId === params.dashboard.userData.userProfile.userName) {
              if (messageUserMapping.status === "U")
                mails[i].readStatus = true;
              else
                mails[i].readStatus = false;
            }
            if (messageUserMapping.userGroupName) {
              mails[i].userGroupName = messageUserMapping.userGroupName;
            }
          }
          if (mails[i].customerID === undefined)
            mails[i].customerID = "";
        }
        return mails;
      };
      self.formatAlertForCustomerID = function(alerts) {
        for (var i = 0; i < alerts.length; i++) {
          var MessageUserMappings = alerts[i].messageUserMappings;
          for (var j = 0; j < MessageUserMappings.length; j++) {
            var messageUserMapping = MessageUserMappings[j];
            if (params.dashboard.userData && messageUserMapping.userId === params.dashboard.userData.userProfile.userName) {
              if (messageUserMapping.status === "U") {
                alerts[i].readStatus = true;
              } else
                alerts[i].readStatus = false;
            }
          }
        }
        return alerts;
      };
      self.formatNotificationsForCustomerID = function(messageUserMappings) {
        for (var j = 0; j < messageUserMappings.length; j++) {
          var MessageUserMapping = messageUserMappings[j];
          if (params.dashboard.userData && MessageUserMapping.userId === params.dashboard.userData.userProfile.userName) {
            if (MessageUserMapping.status === "U") {
              messageUserMappings[j].readStatus = true;
            } else
              messageUserMappings[j].readStatus = false;
          }
        }
        return messageUserMappings;
      };
      $.when(MiniMailboxBaseModel.getMails(), MiniMailboxBaseModel.getAlerts(), MiniMailboxBaseModel.getNotifications()).done(function(mailData, alertData, notificationData) {
        self.alertTab = ko.observable(params.mailbox.unreadAlertCount() !== 0 ? params.baseModel.format(self.nls.mailbox.alertTab, {
          alertUnreadCount: params.mailbox.unreadAlertCount()
        }) : self.nls.mailbox.alerts);
        self.mailTab = ko.observable(params.mailbox.unreadmailCount() !== 0 ? params.baseModel.format(self.nls.mailbox.mailTab, {
          mailUnreadCount: params.mailbox.unreadmailCount()
        }) : self.nls.mailbox.mails);
        self.notificationTab = ko.observable(params.mailbox.unreadNotificationCount() !== 0 ? params.baseModel.format(self.nls.mailbox.notificationTab, {
          unreadNotificationCount: params.mailbox.unreadNotificationCount()
        }) : self.nls.mailbox.notificationTitle);
        var record = self.formatMailsForCustomerID(mailData.mails, "F", false);
        var x;
        for (x = 0; x < record.length; x++) {
          if (record[x].readStatus === true) {
            self.mailsArray.push(record[x]);
          }
        }
        self.mailDataSource(new oj.ArrayTableDataSource(self.mailsArray(), {
          idAttribute: "messageId"
        }));
        self.datasource(self.mailDataSource());
        self.showlist(true);
        var alertRecord = self.formatAlertForCustomerID(alertData.alertDTOs, "T");
        for (x = 0; x < alertRecord.length; x++) {
          if (alertRecord[x].readStatus === true) {
            self.alertsArray.push(alertRecord[x]);
          }
        }
        if (self.alertsArray().length > 0 || self.mailsArray().length > 0 || self.notificationsArray().length > 0) {
          self.showSeeMore(true);
        } else {
          self.showSeeMore(false);
        }
        self.alertDatasource(new oj.ArrayTableDataSource(self.alertsArray(), {
          idAttribute: "messageId"
        }));
        var notificationsRecord = self.formatNotificationsForCustomerID(notificationData.mailerUserMapDTOs, "F", false);
        for (x = 0; x < notificationsRecord.length; x++) {
          if (notificationsRecord[x].readStatus === true) {
            self.notificationsArray.push(notificationsRecord[x]);
          }
        }
        self.notificationDataSource(new oj.ArrayTableDataSource(self.notificationsArray(), {
          idAttribute: "messageId"
        }));
        self.menuOptions = ko.observable([{
          id: "miniMail",
          label: self.mailTab(),
          disabled: false
        }, {
          id: "miniAlert",
          label: self.alertTab(),
          disabled: false
        }, {
          id: "miniNotification",
          label: self.notificationTab(),
          disabled: false
        }]);
        self.displayNavBar(false);
        self.displayNavBar(true);
      });
      self.mailsArray.subscribe(function() {
        if (self.updateMailDatasource() === true) {
          self.mailDataSource(new oj.ArrayTableDataSource(self.mailsArray(), {
            idAttribute: "messageId"
          }));
          self.datasource(self.mailDataSource());
          self.showlist(false);
          self.showlist(true);
        }
      });
      self.alertsArray.subscribe(function() {
        if (self.updateAlertDatasource() === true) {
          self.alertDatasource(new oj.ArrayTableDataSource(self.alertsArray(), {
            idAttribute: "messageId"
          }));
          self.datasource(self.alertDatasource());
          self.showlist(false);
          self.showlist(true);
          self.updateAlertDatasource(false);
        }
      });
      self.notificationsArray.subscribe(function() {
        if (self.updateNotificationDatasource() === true) {
          self.notificationDataSource(new oj.ArrayTableDataSource(self.notificationsArray(), {
            idAttribute: "messageId"
          }));
          self.datasource(self.notificationDataSource());
          self.showlist(false);
          self.showlist(true);
          self.updateNotificationDatasource(false);
        }
      });
      self.updateMailDatasource = ko.observable(false);
      self.uiOptions = {
        "menuFloat": "right",
        "fullWidth": false,
        "defaultOption": self.menuSelection
      };
      self.menuSelection.subscribe(function(newValue) {
        if (newValue === "miniMail") {
          self.menuselected(self.nls.mailbox.mails);
          self.datasource(self.mailDataSource());
        } else if (newValue === "miniAlert") {
          self.menuselected(self.nls.mailbox.alerts);
          self.datasource(self.alertDatasource());
        } else if (newValue === "miniNotification") {
          self.menuselected(self.nls.mailbox.notificationTitle);
          self.datasource(self.notificationDataSource());
        }
      });
      self.loadMailBoxComponent = function(token, data) {
        $("#popup1").hide();
        if (token === "T") {
          self.selectedRecord(data);
          self.miniMailboxParamsObj().tab = self.menuselected();
          self.miniMailboxParamsObj().data = self.selectedRecord();
          params.dashboard.loadComponent("message-base", {
            "miniMailboxParamsObj": self.miniMailboxParamsObj(),
            "selectedMailBoxComponent": self.miniMailboxParamsObj().tab
          }, self);
        } else if (token === "F") {
          params.dashboard.loadComponent("message-base", {
            "miniMailboxParamsObj": null,
            "selectedMailBoxComponent": self.menuselected()
          }, self);
        }
      };
    };
  });
