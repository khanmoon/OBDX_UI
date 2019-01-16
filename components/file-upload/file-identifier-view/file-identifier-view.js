define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/file-identifier-view",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpopup"
], function (ko, $, FUIDViewModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.dashboard.headerName(self.Nls.fIMaintenance);
        self.Nls = resourceBundle.fileIdentifierView;
        self.fileFormatTypesMap = {};
        self.accountTypesMap = {};
        self.fileTypesMap = {};
        self.isFileFormatTypesLoaded = ko.observable(false);
        self.isAccountTypesLoaded = ko.observable(false);
        self.isFileTypesLoaded = ko.observable(false);
        self.back = function () {
            history.go(-1);
        };
        self.cancel = function () {
            self.startEditMode();
        };
        FUIDViewModel.getFileTypes().done(function (data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.fileTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
            self.isFileTypesLoaded(true);
        });
        FUIDViewModel.getFileFormatTypes().done(function (data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.fileFormatTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
            self.isFileFormatTypesLoaded(true);
        });
        FUIDViewModel.getAccountingTypes().done(function (data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.accountTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
            if (self.selectedFUID().fileTemplateDTO.financial)
                self.isAccountTypesLoaded(true);
            else
                self.isAccountTypesLoaded(false);
        });
    };
});