define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "ojL10n!resources/nls/service-requests-configuration",
    "framework/js/constants/constants",
    "jqueryui-amd/widgets/sortable",
    "ojs/ojinputnumber",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, BaseLogger, ResourceBundle, Constants) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.preLoadRootModel = Params.rootModel;
        self.model = Params.model;
        self.validationTracker = Params.validator;
        self.resource = ResourceBundle;
        Params.dashboard.headerName(self.resource.serviceRequest.header);
        self.transactionName = ko.observable("Maintenance");
        self.constants = {};
        self.constants.userSegment = Constants.userSegment;
        if (!self.backFromDetails) {
            self.pagingDatasource = ko.observable();
            self.serviceRequest = ko.observable();
            self.statusType = ko.observable("PE");
            self.requestType = ko.observable("");
            self.refNumber = ko.observable("");
            self.status = ko.observable("");
            self.severity = ko.observable("");
            self.requestName = ko.observable("");
            self.productName = ko.observable("");
            self.requestCategory = ko.observable("");
            var date = Params.baseModel.getDate();
            var date2 = Params.baseModel.getDate();
            date2.setMonth(date.getMonth() - 1);
            self.startDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(date2));
            self.endDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(date));
            self.startDate(self.startDate().substring(0, self.startDate().indexOf("T")));
            self.endDate(self.endDate().substring(0, self.endDate().indexOf("T")));
            self.firstName = ko.observable("");
            self.lastname = ko.observable("");
            self.partyId = ko.observable("");
            self.userName = ko.observable("");
            self.note = ko.observable("");
        }
        self.defaultListLoaded = ko.observable(false);
        self.listArray = ko.observableArray();
        self.statusTypeLoaded = ko.observable(false);
        self.statusTypeArray = ko.observableArray();
        self.requestTypeLoaded = ko.observable(false);
        self.requestTypeArray = ko.observableArray();
        self.productsArray = ko.observableArray();
        self.productsLoaded = ko.observable(false);
        self.severityLoaded = ko.observable(false);
        self.approveRejectButton = ko.observable(true);
        self.productsArray = ko.observableArray();
        self.requestCategoriesLoaded = ko.observable(true);
        self.categoriesLoaded = ko.observableArray();
        self.severityData = ko.observableArray();
        Params.baseModel.registerComponent("service-requests-main", "service-requests");
        self.payload = ko.observable();
        self.gotoMainScreen = function () {
            Params.dashboard.loadComponent("service-requests-base", {}, self);
        };
        self.goBack = function () {
            self.loadSecondScreen(true);
            Params.dashboard.loadComponent("service-requests-base", {}, self);
        };
        self.transformText = function (text) {
            if (!text) {
                return;
            }
            var j, pairs;
            if (text.indexOf("_") > -1) {
                pairs = text.split("_");
                for (j = 0; j < pairs.length; j++) {
                    pairs[j] = pairs[j].substring(0, 1).toUpperCase() + pairs[j].substring(1).toLowerCase();
                }
                text = pairs.join(" ");
            } else if (text.indexOf(" ") === -1) {
                text = text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
            }
            return text;
        };
    };
});
