define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/docked-menu",
    "./model",
    "ojs/ojnavigationlist",
    "ojs/ojconveyorbelt",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, ResourceBundle, Model) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.resource = ResourceBundle;
        var navDataSourceArray = ko.observableArray();
        self.dataSource = new oj.ArrayTableDataSource(navDataSourceArray,{idAttribute: "id"});
        Model.getData().then(function(data){
          ko.utils.arrayPushAll(navDataSourceArray, data.menuItems);
        });
        var genericViewModel = null;
        self.getRootContext = function ($root) {
            genericViewModel = $root;
        };
        self.changePage = function (value) {
            if (value.isModule) {
                rootParams.dashboard.switchModule(value.module || genericViewModel.dashboardRole);
            } else {
                rootParams.baseModel.registerComponent(value.showDetailsParams.id, value.showDetailsParams.module);
                rootParams.dashboard.loadComponent(value.showDetailsParams.id, value.showDetailsParams.params, self);
            }
        };
    };
});
