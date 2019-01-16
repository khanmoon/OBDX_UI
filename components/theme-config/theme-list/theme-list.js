define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/theme-list",
    "ojs/ojinputtext",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojselectcombobox"
], function (oj, ko, $, model, locale) {
    "use strict";
    return function (params) {
        var self = this;
        self.menuSelection = ko.observable("branding");
        self.resourceBundle = locale;
        params.dashboard.headerName(locale.header);
        self.mappingType = ko.observable();
        self.uiOptions = {
            "menuFloat": "left",
            "fullWidth": false,
            "defaultOption": self.menuSelection
        };
        self.entities = ko.observableArray();
        self.arrayDataSource = ko.observableArray();
        self.mappingDataSource = ko.observableArray();
        self.datasource = new oj.ArrayTableDataSource(self.arrayDataSource, {
            idAttribute: "brandId"
        });
        self.mappingList = new oj.ArrayTableDataSource(self.mappingDataSource, {
            idAttribute: "id"
        });
        params.baseModel.registerElement("nav-bar");
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("review-theme", "theme-config");
        params.baseModel.registerComponent("create-theme", "theme-config");
        params.baseModel.registerComponent("create-mapping", "theme-config");
        params.baseModel.registerElement("modal-window");
        params.baseModel.registerElement("help");
        self.menuOptions = ko.observableArray([{
                "id": "branding",
                "label": self.resourceBundle.menu.brand
            },
            {
                "id": "mapping",
                "label": self.resourceBundle.menu.mapping
            }
        ]);
        model.getModuleThemes().done(function (data) {
            self.arrayDataSource(params.baseModel.sortLib(data.brandDTOs, "creationDate", "desc"));
        });
        self.showMapping = ko.observable(false);

        function getMappings(type) {
            if (type.length) {
                model.getMappings(type).done(function (data) {
                    self.mappingDataSource.removeAll();
                    ko.utils.arrayPushAll(self.mappingDataSource, params.baseModel.sortLib(data.brandDTOs, "creationDate", "desc").map(function (item) {
                        item.id = item.mappedType + item.mappedValue;
                        return item;
                    }));
                    self.showMapping(true);
                });
            } else {
                self.showMapping(false);
            }
        }
        model.fetchEntities().done(function (data) {
            self.entities(data.data);
        });
        self.mappingType.subscribe(function (type) {
            self.mappingDataSource.removeAll();
            getMappings(type);
        });
        var styleMap = {
            "--button-primary-background": {
                selector: "#primary-button button",
                property: "background-color"
            },
            "--button-primary-foreground": {
                selector: "#primary-button button",
                property: "color"
            },
            "--button-primary-border-color": {
                selector: "#primary-button button",
                property: "border-color"
            },
            "--button-secondary-background": {
                selector: "#secondary-button button",
                property: "background-color"
            },
            "--button-secondary-foreground": {
                selector: "#secondary-button button",
                property: "color"
            },
            "--button-secondary-border-color": {
                selector: "#secondary-button button",
                property: "border-color"
            },
            "--button-tertiary-background": {
                selector: "#tertiary-button button",
                property: "background-color"
            },
            "--button-tertiary-foreground": {
                selector: "#tertiary-button button",
                property: "color"
            },
            "--button-tertiary-border-color": {
                selector: "#tertiary-button button",
                property: "border-color"
            },
            "--button-help-background": {
                selector: "#help-button button",
                property: "background-color"
            },
            "--button-help-foreground": {
                selector: "#help-button button",
                property: "color"
            },
            "--button-help-border-color": {
                selector: "#help-button button",
                property: "border-color"
            },
            "--button-padding-top-bottom":{
                selector: "#help-button button,#primary-button button,#secondary-button button,#tertiary-button button",
                property: ["padding-top","padding-bottom"]
            },
            "--button-padding-left-right":{
                selector: "#help-button button,#primary-button button,#secondary-button button,#tertiary-button button",
                property: ["padding-left","padding-right"]
            },
            "--button-border-radius":{
                selector: "#help-button button,#primary-button button,#secondary-button button,#tertiary-button button",
                property: "border-radius"
            },
            "--button-border-width":{
                selector: "#help-button button,#primary-button button,#secondary-button button,#tertiary-button button",
                property: "border-width"
            },
            "--button-font-size-text":{
                selector: "#help-button button,#primary-button button,#secondary-button button,#tertiary-button button",
                property: "font-size"
            },
            "--header-background-color":{
                selector: "#preview-header",
                property: "background-color"
            },
            "--header-foreground-color":{
                selector: "#preview-header",
                property: "color"
            },
            "--footer-background-color":{
                selector: "#preview-footer",
                property: "background-color"
            },
            "--footer-foreground-color":{
                selector: "#preview-footer",
                property: "color"
            }
        };
        self.viewTheme = function (data) {
            params.dashboard.loadComponent("review-theme", {
                mode: "view",
                data: data,
                styleMap: styleMap
            }, self);
        };
        self.applyTheme = function (data) {
            model.applyTheme(data.brandId, self.menuSelection()).done(function (data, status, jqXHR) {
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: params.baseModel.format(self.resourceBundle.brandDeploy, {
                        brandId: data.brandDTO.brandId
                    })
                }, self);
            });
        };

        self.createTheme = function () {
            params.dashboard.loadComponent("create-theme", {
                mode: "create",
                roles: self.menuOptions(),
                styleMap: styleMap
            }, self);
        };
        self.createMapping = function () {
            params.dashboard.loadComponent("create-mapping", {
                mode: "create",
                brandList: self.arrayDataSource,
                selectedOption: self.mappingType()
            }, self);
        };
        var mapToDelete;
        self.deleteMapping = function (data) {
            mapToDelete = data;
            $("#deleteMappingConfirm").trigger("openModal");
        };
        self.closeDelete = function () {
            $("#deleteMappingConfirm").hide();
        };
        self.confirmDelete = function () {
            model.deleteMapping(mapToDelete.mappedType, mapToDelete.mappedValue).done(function () {
                $("#deleteMappingConfirm").hide();
                getMappings(self.mappingType());
                params.baseModel.showMessages(null, [self.resourceBundle.deleteSuccess], "INFO");
            });
        };
    };
});