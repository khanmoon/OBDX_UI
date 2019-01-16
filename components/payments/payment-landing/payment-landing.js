define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/payment-landing",
    "json!local!./payment-landing-items",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, ResourceBundle, LandingJSON) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.datasource = new oj.ArrayTableDataSource(rootParams.baseModel.cordovaDevice() ? LandingJSON.mobile.items : LandingJSON.web.items, { idAttribute: "id" });
        rootParams.dashboard.headerName(self.resource.header);
        self.clickHandler = function (context) {
            rootParams.baseModel.registerComponent(context.component, context.module);
            rootParams.dashboard.loadComponent(context.component, context.params || {});
        };
    };
});
