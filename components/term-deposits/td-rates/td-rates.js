define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",

    "ojL10n!resources/nls/td-rates",
    "ojs/ojknockout-validation",
    "ojs/ojbutton",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox"
], function (oj, ko, TDCalculatorModel, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerElement("action-widget");
        self.listItem = ko.observableArray();
        self.tdRatesLoaded = ko.observable(false);
        self.datasource = ko.observableArray();
        TDCalculatorModel.getTDRates().done(function (data) {
            self.listItem(data.rates);
            self.tdRatesLoaded(true);
            self.datasource(new oj.ArrayTableDataSource(self.listItem()));
        });
    };
});