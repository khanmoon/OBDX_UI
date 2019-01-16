define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "framework/js/constants/constants",
    "ojL10n!resources/nls/mailers",
    "ojs/ojinputtext",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable"
], function (oj, ko, $, BaseLogger, constants, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.data = rootParams.dataSource;
        self.createDataSource = function () {
            var bulletinData = $.map(self.data, function (val) {
                val.ID = val.messageId.displayValue;
                val.description = val.description ? val.description : "-";


                return val;
            });
            self.paginationDataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(bulletinData, { idAttribute: "ID" }));
            self.mailersListFetched(true);
        };
        rootParams.baseModel.registerComponent("view", "mailers");
        self.createDataSource();
        self.onMailerSelected = function (data) {
            var context = {};
            context = data;
            context.mode = "VIEW";
            rootParams.dashboard.loadComponent("view", context, self);
        };
    };
});