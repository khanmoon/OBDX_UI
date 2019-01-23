define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/mailbox",
    "ojs/ojtoolbar",
    "ojs/ojnavigationlist"
], function (oj, ko, $, MessageDetailModel, resourceBundle) {
    "use strict";
    return function (params) {
        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;
        self.messageBody = ko.observable(params.data.messageDetails().mailerUserMapDTO.messageBody);
        self.subject = ko.observable(params.data.messageDetails().mailerUserMapDTO.subject);
        self.date = ko.observable(params.baseModel.formatDate(params.data.messageDetails().mailerUserMapDTO.receivedDate, "dateTimeStampFormat"));
        self.toShow = ko.observable(false);
        self.deletePayload = ko.observableArray();
        self.mappedNotifications = ko.observableArray();
        params.baseModel.registerElement("action-header");
        self.confirmDelete = function () {
            $("#deleteNotification").trigger("openModal");
        };

        self.closeModal = function(){
          $("#deleteNotification").hide();
        };
        self.back = function () {
            self.notificationListLoaded(true);
            self.showDetailedMessage(false);
            self.refreshNotifications();
        };
        self.submit = function () {
            self.toShow(false);
            $("#deleteNotification").hide();
            self.deletePayload = {
                status: "D",
                mapId: ""
            };
            self.deletePayload.mapId = params.data.messageDetails().mapId;
            var payload = ko.toJSON(self.deletePayload);
            self.mappedNotifications.push({
                methodType: "PUT",
                uri: {
                    value: "/mailbox/mailers/{mapId}",
                    params: { mapId: self.deletePayload.mapId }
                },
                payload: payload,
                headers: {
                    "Content-Id": 0,
                    "Content-Type": "application/json"
                }
            });
            MessageDetailModel.fireBatch({ batchDetailRequestList: self.mappedNotifications() }).done(function () {
                self.showHeaderMenu(false);
                self.refreshNotifications();
                self.mappedNotifications([]);
                self.showDetailedMessage(false);
            });
        };
    };
});
