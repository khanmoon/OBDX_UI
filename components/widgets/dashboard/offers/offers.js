define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/offers",
    "framework/js/constants/constants",
    "text!./offers.json",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, Model, ResourceBundle, Constants,offersJSON) {
    "use strict";
    return function () {
        var self = this;
        self.resource = ResourceBundle;
        self.offers = ko.observableArray();
        self.userSegment = Constants.userSegment;
        self.dataSource = new oj.ArrayTableDataSource(self.offers, { idAttribute: "id" });
        self.offers(JSON.parse(offersJSON).offers);
    };
});