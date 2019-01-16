define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "ojL10n!resources/nls/generic",
    "ojs/ojnavigationlist",
    "ojs/ojconveyorbelt",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, BaseLogger, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.navigationLevel = ko.observable("page");
        self.locale = locale;
        self.menuOptions = null;
        self.iconAvailable = rootParams.uiOptions.iconAvailable;
        self.menuCountOptions = null;
        self.navBarDescription = rootParams.navBarDescription;
        self.dataSource = new oj.ArrayTableDataSource(rootParams.menuOptions,{idAttribute:"id"});
        self.selectedNode = rootParams.uiOptions.defaultOption;
        self.styleClass = ko.pureComputed(function () {
            var classes = rootParams.uiOptions.fullWidth ? "" : "oj-sm-condense";
            switch (rootParams.uiOptions.menuFloat) {
            case "center":
                classes += " center";
                break;
            case "left":
                classes += " pull-left";
                break;
            case "right":
                classes += " pull-right";
                break;
            }
            return classes;
        });
        self.type = rootParams.uiOptions.type ? rootParams.uiOptions.type : "top";
    };
});
