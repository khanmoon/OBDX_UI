define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/create-theme",
    "ojs/ojknockout",
    "ojs/ojcolor",
    "ojs/ojcolorspectrum",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojinputnumber",
    "ojs/ojaccordion",
    "ojs/ojfilepicker",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, model, locale) {
    "use strict";
    return function (params) {
        var self = this;
        self.resourceBundle = locale;
        self.validationTracker = ko.observable();
        self.validationTrackerID = "validationTrackerID" + params.baseModel.incrementIdCount();
        params.dashboard.headerName(self.resourceBundle.heading.saveTheme);
        self.currentObj = null;
        self.modelInit = ko.observable(false);
        self.colorValue = ko.observable(new oj.Color("rgba(255,255,255,0.8)"));
        self.sizeUnit = "rem";
        self.themeData = {};
        self.zip = null;
        self.parameters = params.rootModel.params;
        self.styleMap=params.rootModel.params.styleMap;
        params.baseModel.registerComponent("review-theme", "theme-config");
        params.baseModel.registerComponent("preview-theme", "theme-config");
        params.baseModel.registerComponent("help-box", "theme-config");
        params.baseModel.registerElement("color-picker");
        params.baseModel.registerElement("modal-window");
        self.currentTokens = {};
        self.factoryTokens = {};
        self.refreshPreview=ko.observable(true);
        function loadFonts(url) {
            var style = document.createElement("style");
            style.textContent = "@import url(" + url + ")";
            document.head.appendChild(style);
        }

        function setCSSProps(propertyName, value) {
            if (propertyName === "--base-font-url") {
                loadFonts(value);
            }
            if (typeof value === "number") value += self.sizeUnit;
            document.documentElement.style.setProperty(propertyName, value);
        }

        self.saveTheme = function () {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById(self.validationTrackerID)) || !self.zip) {
                if (!self.zip) {
                    params.baseModel.showMessages(null, [self.resourceBundle.fileInvalid], "ERROR");
                }
                return;
            }
            model.uploadDocument(ko.mapping.toJS(self.themeData), self.zip).done(function (data, status, jqXhr) {
                self.resetColors();
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.resourceBundle.themeTransaction
                }, self);
            });
        };

        self.updateTheme = function () {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById(self.validationTrackerID)) || !self.zip) {
                if (!self.zip) {
                    params.baseModel.showMessages(null, [self.resourceBundle.fileInvalid], "ERROR");
                }
                return;
            }
            model.updateDocument(ko.mapping.toJS(self.themeData), self.zip, params.rootModel.params.data.brandId).done(function (data, status, jqXhr) {
                self.resetColors();
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.resourceBundle.updateTransaction
                }, self);
            });
        };
        var colorParent = null;
        self.setColor = function (currentObj, currentParent) {
            self.currentObj = currentObj;
            colorParent = currentParent;
            $("#colorPaletteModal").trigger("openModal");
        };

        var getTargetLinkageModel = function (data) {
            var KoModel = model.getTargetLinkageModel(data);
            return ko.mapping.fromJS(KoModel);
        };
        self.saveSelectedColor = function () {
            self.themeData.styleAsset[colorParent][self.currentObj](self.colorValue().toString());
            setCSSProps(self.currentObj, self.colorValue().toString());

            $("#colorPaletteModal").hide();
        };
        self.saveBaseColor = function () {
            self.themeData.styleAsset["base-colors"][self.currentObj](self.colorValue().toString());
            setCSSProps(self.currentObj, self.colorValue().toString());
            $("#colorPaletteModal").hide();
        };
        self.resetColors = function (defaultTokens, clearModelInstance) {
            self.refreshPreview(false);
            clearModelInstance = clearModelInstance || false;
            defaultTokens = defaultTokens || self.currentTokens;
            Object.keys(defaultTokens).forEach(function (propType) {
                var type = propType;
                Object.keys(defaultTokens[type]).forEach(function (token) {
                    setCSSProps(token, defaultTokens[type][token]);
                    if (clearModelInstance) {
                        self.themeData.styleAsset[type][token](defaultTokens[type][token]);
                    }
                });
            });
            self.refreshPreview(true);
        };
        self.zipFileUploadListener = function (event) {
            self.zip = (event.detail.files[0]);
            $("#selectedFileNotification").html(params.baseModel.format(self.resourceBundle.fileSelection, {
                fileName: self.zip.name
            }));
        };
        self.showZipFileHelp = function () {
            $("#zipFileHelp").trigger("openModal");
        };
        self.disposeSubscribers = [];
        var units = {
            "base-variables": self.sizeUnit,
            "button-variables": self.sizeUnit,
            "banner-variables": self.sizeUnit,
            "form-variables": self.sizeUnit,
            "fontSize":self.sizeUnit,
            "font-weights": "",
            "button-colors": ""
        };
        function setVariablesListeners() {
            var variables = ["base-variables", "button-variables", "banner-variables", "form-variables", "font-weights","fontSize"];

            variables.forEach(function (variable) {
                Object.keys(self.themeData.styleAsset[variable]).forEach(function (key) {
                    (function (key) {
                        self.disposeSubscribers.push(self.themeData.styleAsset[variable][key].subscribe(function (newValue) {
                            setCSSProps(key, newValue + units[variable]);
                            self.afterColorRender(key,newValue,variable);
                        }));
                    })(key);
                });
            });
        }
        model.getBrandVariables().then(function (data) {
            $.extend(self.factoryTokens, data);
            if (params.rootModel.params.mode !== "edit") {
                $.extend(self.currentTokens, data);
                $.extend(self.themeData, getTargetLinkageModel(data));
            } else {
                params.dashboard.headerName(self.resourceBundle.heading.updateTheme);
                var theme = params.rootModel.params.data;
                theme.styleAsset = ko.mapping.toJS(theme.styleAsset);
                $.extend(self.currentTokens, theme.styleAsset);
                $.extend(self.themeData, getTargetLinkageModel(theme.styleAsset));
                self.themeData.brandName(theme.brandName);
                self.themeData.brandDescription(theme.brandDescription);
                self.resetColors(self.currentTokens, true);
            }
            self.modelInit(true);
            setVariablesListeners();
        });
        self.dispose = function () {
            this.resetColors(this.factoryTokens);
            for (var i = 0; i < self.disposeSubscribers.length; i++) {
                self.disposeSubscribers[i].dispose();
            }
        };

        self.afterColorRender=function(prop,value,unit){
            if(self.styleMap[prop]){
                setTimeout(function(){
                    var props=self.styleMap[prop].property;
                    if(!Array.isArray(props)) props = [props];
                    props.forEach(function(property){
                        $(self.styleMap[prop].selector).css(property,value+units[unit]);
                    });
                },1000);
            }
        };
    };
});
