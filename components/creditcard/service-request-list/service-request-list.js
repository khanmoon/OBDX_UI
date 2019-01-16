define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/service-request",
    "ojs/ojknockout",
    "ojs/ojlistview",
    "ojs/ojmodel",
    "ojs/ojselectcombobox",

    "ojs/ojpagingcontrol",

    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojdatetimepicker",
    "ojs/ojfilmstrip",
    "ojs/ojbutton",
    "ojs/ojmenu",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation",
    "promise"
], function (oj, ko, $, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.detailsFetched = ko.observable(false);
        self.componentName = ko.observable("date-box");
        self.requestList = ko.observableArray([]);
        self.displayList = ko.observable(false);
        self.datasource = {};
        self.resource = ResourceBundle;
        ko.utils.extend(self, rootParams.rootModel);
        self.componentName = ko.observable("date-box");
        rootParams.dashboard.headerName(self.resource.serviceRequest.cardHeading);
        if (self.serviceRequests()) {
            for (var i = 0; i < self.serviceRequests().length; i++) {
                var v = self.serviceRequests()[i];
                v.uniqueId = "ccsr" + i;
                self.requestList.push(v);
            }
            self.serviceRequests.sort(function (a, b) {
                return new Date(b.creationDate) - new Date(a.creationDate);
            });
            self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.requestList, { idAttribute: "uniqueId" }));
            self.displayList(true);
        }
        self.etaPiSigma = function () {
            $(".oj-pagingcontrol-nav-arrow").css("width", "7.286rem");
            $(".oj-component-icon").css("font-size", "20px");
        };
    };
});