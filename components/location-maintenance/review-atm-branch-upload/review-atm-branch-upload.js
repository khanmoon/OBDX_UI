define([
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/review-location-add"
], function (ko, $, ReviewLocationUploadModel, locale) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.nls = locale;
        self.reviewData = ko.toJS(params.rootModel);
        self.back = ko.observable(false);
        self.response = ko.observable();
        params.dashboard.headerName(self.nls.headings.transactionName);
        params.baseModel.registerComponent("location-add", "location-maintenance");
        self.confirmForUpload = function () {
            if (self.fileData()) {
                if (self.fileData().properties.size <= 0) {
                    params.baseModel.showMessages(null, [self.nls.headings.emptyFileErrorMsg], "INFO");
                    return;
                }
                if (self.fileData().properties.size > 1048576) {
                    params.baseModel.showMessages(null, [self.nls.headings.fileSizeErrorMsg], "INFO");
                    return;
                }
                ReviewLocationUploadModel.uploadDocument(self.fileData().properties, self.selectedType().toUpperCase()).done(function (data, status, jqXhr) {
                    self.recordId(data.recordId);
                    params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.nls.headings.transactionName,
                        template: "admin/location-confirm-screen"
                    }, self);
                });
            } else {
                params.baseModel.showMessages(null, [self.nls.headings.noFileFoundErrorMessage], "INFO");

            }
        };
        self.edit = function () {
            self.back(true);
            params.dashboard.loadComponent("location-add", {}, self);
        };
        self.downloadFile = function () {
            ReviewLocationUploadModel.fetchPDF(self.recordId());
        };
    };
});
