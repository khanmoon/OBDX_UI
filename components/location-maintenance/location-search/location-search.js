define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/location-search",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset",
    "ojs/ojinputtext"
], function (oj, ko, $, LocationSearchModel, locale) {
    "use strict";
    return function (params) {
        var self = this;

        self.countryEnumsLoaded = ko.observable(false);
        self.selectedcountry = ko.observable("");
        self.countryEnums = ko.observableArray();
        self.city = ko.observable();
        self.id = ko.observable();
        self.atmAndBranch = ko.observable([]);
        self.type = ko.observable();
        self.showResults = ko.observable(false);
        self.results = ko.observableArray();
        params.baseModel.registerElement("page-section");
        params.baseModel.registerComponent("location-search-results", "location-maintenance");
        params.baseModel.registerComponent("location-add", "location-maintenance");
        ko.utils.extend(self, params.rootModel);
        self.nls = locale;
        params.dashboard.headerName(self.nls.pageTitle.header);
        LocationSearchModel.fetchCountry().done(function (data) {
            self.countryEnums(data.enumRepresentations[0].data);
            self.countryEnumsLoaded(true);
        });
        self.clear = function () {
            self.selectedcountry([]);
            self.city("");
            self.id("");
        };
        self.create = function () {
            params.dashboard.loadComponent("location-add", {}, self);
        };
        self.search = function () {
            self.showResults(false);
            if (self.atmAndBranch().length === 1) {
                if (self.atmAndBranch()[0] === "ATM")
                    self.type("ATM");
                else if (self.atmAndBranch()[0] === "Branch")
                    self.type("BRANCH");
            } else
                self.type("");
            var searchParameters = {
                "countryRegion": self.selectedcountry(),
                "city": self.city(),
                "id": self.id(),
                "type": self.type()
            };
            LocationSearchModel.fetchATMBranch(searchParameters).done(function (data) {
                self.results(data.addressDTO);
                if (self.results().length > 0) {
                    self.showResults(true);
                } else {
                    self.showResults(false);
                    params.baseModel.showMessages(null, [self.nls.message.noRecordFound], "ERROR");
                }
            });
        };
    };
});
