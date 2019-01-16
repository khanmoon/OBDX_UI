define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",

    "framework/js/constants/constants",
    "ojL10n!resources/nls/mailers",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojdatetimepicker",
    "ojs/ojradioset",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource"
], function (oj, ko, MailerBaseModel, $, constants, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.searchFlag = rootParams.rootModel.searchFlag ? rootParams.rootModel.searchFlag : ko.observable(false);
        self.fetchedBulletin = self.fetchedBulletin || ko.observableArray();
        rootParams.baseModel.registerComponent("mailer-create", "mailers");
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerComponent("search-list", "mailers");
        self.mailersListFetched = ko.observable(false);
        self.description = ko.observable();
        self.code = ko.observable();
        self.sendDate = ko.observable();
        self.sendTime = ko.observable();
        self.sendHour = ko.observable();
        self.sendMinute = ko.observable();
        self.subject = ko.observable();
        self.theme = ko.observable();
        self.activationDate = ko.observable();
        self.priority = ko.observable();
        self.searchedMailerList = rootParams.rootModel.searchedMailerList ? rootParams.rootModel.searchedMailerList : ko.observable();
        rootParams.dashboard.headerName(self.nls.headers.heading);
        self.openCreateComponent = function () {
            rootParams.dashboard.loadComponent("mailer-create", {}, self);
        };
        self.clear = function () {
            self.description("");
            self.code("");
            self.mailersListFetched(false);
        };
        self.fetchMailersList = function () {
            MailerBaseModel.fetchMailersList(self.description(), self.code()).done(function (data) {
                self.searchedMailerList(data.mailer);
                self.searchFlag(true);
            });
        };
        self.cancel = function () {
            rootParams.dashboard.openDashBoard();
        };
    };
});
