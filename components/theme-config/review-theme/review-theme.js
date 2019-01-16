define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/review-theme",
    "ojs/ojaccordion"
], function (ko, $, model, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerComponent("preview-theme", "theme-config");
        self.parameters = rootParams.rootModel.params;
        self.resourceBundle = locale;
        self.sizeUnit = "rem";
        self.theme = rootParams.rootModel.params.data;
        self.styleMap=rootParams.rootModel.params.styleMap;
        self.showReviewPage = ko.observable(false);
        rootParams.dashboard.headerName(self.resourceBundle.headerName);
        self.editTheme = function () {
            rootParams.dashboard.loadComponent("create-theme", {
                mode: "edit",
                data: self.theme,
				styleMap : self.styleMap
            }, self);
        };
        self.appendSizeUnit = function (string) {
            return string + self.sizeUnit;
        };
        self.downloadImageAssets = function (theme) {
            model.downloadImageAssets(theme.brandId);
        };
        self.deleteTheme = function (theme, isDeleteConfirmed) {
            if (!isDeleteConfirmed) {
                $("#confirmDelete").trigger("openModal");

            } else {
                model.deleteDocument(theme.brandId).done(function (data, status, jqXhr) {
                    $("#confirmDelete").hide().trigger("closeModal");
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.resourceBundle.deleteThemeTransaction
                    }, self);
                });
            }
        };
        model.fetchAssets(self.theme.brandId).done(function (data) {
            self.theme.styleAsset = ko.mapping.fromJS(data);
            self.showReviewPage(true);
        });
        var sizeUnits = {
            "button-variables": self.sizeUnit,
            "button-colors": ""
        };
        self.afterColorRender=function(prop,value,unit){
            if(self.styleMap[prop]){
                setTimeout(function(){
                    var props=self.styleMap[prop].property;
                    if(!Array.isArray(props)) props = [props];
                    props.forEach(function(property){
                        $(self.styleMap[prop].selector).css(property,value+sizeUnits[unit]);
                    });
                },1000);
            }
        };
    };
});