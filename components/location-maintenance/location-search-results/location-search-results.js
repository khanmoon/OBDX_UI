define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/location-search-results",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource"
], function (oj, ko, $, model, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = locale;
        self.locationDetails = ko.observable();
        rootParams.baseModel.registerComponent("location-read", "location-maintenance");
        self.resultsDataSource = new oj.ArrayTableDataSource(self.results(), { idAttribute: "id" });
        self.paginationDataSource = new oj.PagingTableDataSource(self.resultsDataSource);
        self.showLocationDetails = function (locationDetails) {
            self.locationDetails(locationDetails);
            rootParams.dashboard.loadComponent("location-read", {}, self);
        };
        self.renderAddress = function (data) {
            var address = "";
            address = data.postalAddress.line1 + ", " + data.postalAddress.line2 + ", " + data.postalAddress.city + ", " + data.postalAddress.country;
            return address;
        };
    };
});