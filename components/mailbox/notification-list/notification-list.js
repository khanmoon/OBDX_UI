define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "ojL10n!resources/nls/mailbox",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function(oj, ko, $, NotificationModel, resourceBundle) {
  "use strict";
  return function(params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;
    self.messageDetails = ko.observable();
    params.dashboard.headerName(self.nls.mailbox.headers.notification);
    self.notificationListLoaded = ko.observable(false);
    self.messages = ko.observableArray();
    self.s = ko.observable();
    self.deletePayload = ko.observableArray();
    self.mailerUserMaps = ko.observableArray();
    self.mappedNotifications = ko.observableArray();
    self.showHeaderMenu = ko.observable(false);
    self.updateNotificationDatasource = ko.observable(false);
    self.arrayDataSource = new oj.ArrayTableDataSource([], {
      idAttribute: "notificationid"
    });
    self.paginationDataSource = new oj.PagingTableDataSource(self.arrayDataSource);
    self.toShow = ko.observable(false);
    if (self.messages().length > 0) {
      self.toShow(true);
    }
    self.notificationMessageList = ko.observableArray([]);
    self.showDetailedMessage = ko.observable(false);
    params.baseModel.registerComponent("notification-detail", "mailbox");
    self.messages = ko.observableArray();
    self.unreadCount = ko.observable(0);
    var unreadcountcheck;
    self.unReadCountCall = function(count) {
      self.unreadCount(count);
    };
    if (!self.unreadNotificationCount)
      self.unreadNotificationCount = ko.observable(0);
    if (self.miniMailboxObj === undefined)
      self.miniMailboxObj = ko.observable();
    params.baseModel.registerElement("date-time");
    params.baseModel.registerElement("modal-window");
    NotificationModel.fetchNotificationList().done(function(notificationData) {
      var inboxNotifications = self.formatNotificationForCustomerID(notificationData.mailerUserMapDTOs, "T");
      self.notificationMessageList(inboxNotifications);
      var notificationListMap = $.map(self.notificationMessageList(), function(notification) {
        notification.notificationid = notification.messageId.value;
        return notification;
      });
      self.arrayDataSource.reset(notificationListMap || [], {
        idAttribute: "notificationid"
      });
      if (self.miniMailboxObj()) {
        if (self.miniMailboxObj().data.messageId) {
          var deleteItem;
          if (self.miniMailboxObj().tab.toUpperCase() === "NOTIFICATIONS") {
            var messageId = self.miniMailboxObj().data.messageId.value;
            ko.utils.arrayForEach(self.notificationMessageList(), function(item) {
              if (messageId === item.messageId.value) {
                self.onMessageRowClicked(item);
                self.updateNotificationDatasource(true);
                ko.utils.arrayForEach(self.notificationsArray(), function(item) {
                  if (self.miniMailboxObj().data.messageId.value === item.messageId.value) {
                    deleteItem = item;

                  }
                });
                self.notificationsArray.remove(deleteItem);

              }
            });
            self.notificationListLoaded(false);
            self.miniMailboxObj(null);
          }
        } else {
          self.notificationListLoaded(false);
          self.notificationListLoaded(true);
        }
      } else {
        self.notificationListLoaded(false);
        self.notificationListLoaded(true);
      }
    });
    $(document).on("change", "#mailBoxPaging_nav_input", function() {
      $("#headerbox_labelID").prop("checked", false);
    });
    $(document).ready(function() {
      $(document).on("change", "input[name*=_selection]", function() {
        self.toShow(!!$("input[name*=_selection]:checked").length);
        $("input[name=selectionParent]").prop("checked", $("input[name*=_selection]:checked").length === $("input[name*=_selection]").length);
      });
      $(document).on("change", "input[name=selectionParent]", function() {
        $("input[name*=_selection]").prop("checked", $("input[name=selectionParent]").prop("checked"));
        self.toShow(!!$("input[name*=_selection]").length && !!$("input[name=selectionParent]").prop("checked"));
      });
    });
    self.showModalWindow = function() {
      self.messages($("input[name*=_selection]:checked").map(function() {
        return this.value;
      }).get());
      if (self.messages()) {
        if (self.messages().length >= 2) {
          self.s("s");
        } else {
          self.s("");
        }
        if (self.messages().length <= 0) {
          return false;
        }
      }
      $("#deleteNotificationsConfirmation").trigger("openModal");
      self.deletePayload().messageId = self.messages();
    };

    self.closeModal = function() {
      $("#deleteNotificationsConfirmation").hide();
    };

    self.renderCheckBox = function(context) {
      var checkBox = $(document.createElement("input"));
      var label = $(document.createElement("label"));
      checkBox.attr("type", "checkbox");
      checkBox.attr("value", context.row.mapId);
      checkBox.attr("name", context.row.mapId + "_selection");
      label.attr("class", "oj-checkbox-label hide-label");
      checkBox.attr("id", context.row.mapId + "_labelID");
      label.attr("for", context.row.mapId + "_labelID");
      label.text(self.nls.mailbox.headers.notification);
      $(context.cellContext.parentElement).append(checkBox);
      $(context.cellContext.parentElement).append(label);
      $("#headerbox_labelID").prop("checked", false);
      self.toShow(false);
    };
    self.renderHeadCheckBox = function(context) {
      var checkBox = $(document.createElement("input"));
      var label = $(document.createElement("label"));
      checkBox.attr("type", "checkbox");
      checkBox.attr("value", "selectAll");
      checkBox.attr("name", "selectionParent");
      checkBox.attr("id", "headerbox_labelID");
      label.attr("class", "oj-checkbox-label hide-label");
      label.attr("for", "headerbox_labelID");
      label.text(self.nls.mailbox.headers.notification);
      $(context.headerContext.parentElement.firstElementChild.firstChild).append(checkBox);
      $(context.headerContext.parentElement.firstElementChild.firstChild).append(label);
    };
    self.refreshNotifications = function() {
      NotificationModel.fetchNotificationList().done(function(data) {
        var inboxNotifications = self.formatNotificationForCustomerID(data.mailerUserMapDTOs, "X");
        self.notificationMessageList(inboxNotifications);
        var notificationListMap = $.map(self.notificationMessageList(), function(notification) {
          notification.notificationid = notification.messageId.value;
          return notification;
        });
        self.arrayDataSource.reset(notificationListMap || [], {
          idAttribute: "notificationid"
        });
        self.notificationListLoaded(false);
        self.notificationListLoaded(true);
        $("#headerbox_labelID").prop("checked", false);
      });
    };
    self.refreshNotificationsCount = function() {
      NotificationModel.fetchNotificationList().done(function(data) {
        var inboxNotifications = self.formatNotificationForCustomerID(data.mailerUserMapDTOs, "X");
        self.notificationMessageList(inboxNotifications);
        var notificationListMap = $.map(self.notificationMessageList(), function(notification) {
          notification.notificationid = notification.messageId.value;
          return notification;
        });
        self.arrayDataSource.reset(notificationListMap || [], {
          idAttribute: "notificationid"
        });
      });
    };
    self.formatNotificationForCustomerID = function(messageUserMappings) {
      unreadcountcheck = 0;
      for (var j = 0; j < messageUserMappings.length; j++) {
        var MessageUserMapping = messageUserMappings[j];
        if (MessageUserMapping.userId === params.dashboard.userData.userProfile.userName) {
          if (MessageUserMapping.status === "U") {
            messageUserMappings[j].readStatus = true;
            unreadcountcheck++;
          } else
            messageUserMappings[j].readStatus = false;
        }
      }
      self.unReadCountCall(unreadcountcheck);
      self.unreadNotificationCount(unreadcountcheck);
      return messageUserMappings;
    };
    self.submit = function() {
      for (var i = 0; i < self.messages().length; i++) {
        self.mailerUserMaps = {
          status: "D",
          mapId: ""
        };
        self.mailerUserMaps.mapId = self.messages()[i];
        var payload = ko.toJSON(self.mailerUserMaps);
        self.mappedNotifications.push({
          methodType: "PUT",
          uri: {
            value: "/mailbox/mailers/{mapId}",
            params: {
              mapId: self.mailerUserMaps.mapId
            }
          },
          payload: payload,
          headers: {
            "Content-Id": i,
            "Content-Type": "application/json"
          }
        });
      }
      NotificationModel.fireBatch({
        batchDetailRequestList: self.mappedNotifications()
      }).done(function() {
        self.showHeaderMenu(false);
        self.toShow(false);
        $("#deleteNotificationsConfirmation").hide();
        self.deletePayload([]);
        self.mappedNotifications([]);
        self.refreshNotifications();
        params.dashboard.getMailCount();
      });
    };
    self.onMessageRowClicked = function(rowData) {
      NotificationModel.readMailer(rowData.messageId.value).done(function(data) {
        data.mapId = rowData.mapId;
        self.messageDetails(data);
        self.showDetailedMessage(true);
        self.mailerUserMaps = {
          messageId: "",
          status: "R",
          mapId: ""
        };
        if (self.messages()) {
          self.mailerUserMaps.messageId = rowData.messageId.value;
          self.mailerUserMaps.mapId = data.mapId;
        }
        var payload = ko.toJSON(self.mailerUserMaps);
        self.mappedNotifications.push({
          methodType: "PUT",
          uri: {
            value: "/mailbox/mailers/{mapId}",
            params: {
              mapId: self.mailerUserMaps.mapId
            }
          },
          payload: payload,
          headers: {
            "Content-Id": 0,
            "Content-Type": "application/json"
          }
        });
        NotificationModel.fireBatch({
          batchDetailRequestList: self.mappedNotifications()
        }).done(function() {
          self.toShow(false);
          self.deletePayload([]);
          self.mappedNotifications([]);
          self.refreshNotificationsCount();
          params.dashboard.getMailCount();
        });
        self.notificationListLoaded(false);
      });
    };
  };
});
