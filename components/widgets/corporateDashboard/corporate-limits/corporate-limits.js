define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/corporate-limits",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, ReportsModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.allItems = ko.observableArray([
            {
                "id": 1,
                "item": "ABC"
            },
            {
                "id": 2,
                "item": "XYZ"
            },
            {
                "id": 3,
                "item": "MNP"
            },
            {
                "id": 4,
                "item": "OPQ"
            }
        ]);
        self.dataSource = new oj.ArrayTableDataSource(this.allItems, { idAttribute: "id" });
        self.renderer = function (context) {
            return { "insert": context.data.item };
        };
    };
});