define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/mailbox",
    "ojs/ojtoolbar",
    "ojs/ojnavigationlist",
    "ojs/ojtabs",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource",
    "ojs/ojvalidation"
], function (oj, ko, $, MailboxBaseModel, resourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        self.nls = resourceBundle;
        ko.utils.extend(self, params.rootModel);
        params.baseModel.registerComponent("message-nav-bar", "mailbox");
        self.nls = resourceBundle;
        self.selectedMailBoxComponent = ko.observable();
        self.miniMailboxObj = ko.observable(self.params.miniMailboxParamsObj);
        if (self.miniMailboxObj()) {
            self.selectedMailBoxComponent(self.miniMailboxObj().tab);
        } else {
            self.selectedMailBoxComponent(self.params.selectedMailBoxComponent);
        }
        params.dashboard.headerName(self.nls.mailbox.headers.message);
        self.componentId = ko.observable();
        self.setComponentId = function (id) {
            self.componentId(id);
        };
    };
});