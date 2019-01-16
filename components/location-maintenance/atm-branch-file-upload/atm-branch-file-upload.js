define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/location-add",
    "./model",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext",
    "ojs/ojcheckboxset",
    "ojs/ojradioset",
    "ojs/ojbutton"
], function (ko, $, resourceBundle, LocationUploadModel) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.id = ko.observable(rootParams.id);
        self.filename = ko.observable();
        self.showReview = ko.observable(false);
        self.recordId = ko.observable();
        self.fileData = ko.observable();
        $(".input-file").each(function () {
            var $input = $(this);
            var $label = $input.next("label");
            $input.on("change", function (e) {
                var fileName = "";
                if (e.target.value) {
                    fileName = e.target.value.split("\\").pop();
                }
                if (fileName) {
                    $label.html(fileName);
                } else {
                    $label.html(self.nls.fieldname.uploadFile);
                }
                var file = {};
                file.properties = document.getElementById("input").files[0];
                self.fileData(file);
                self.filename(fileName);
            });
            $input.on("focus", function () {
                $input.addClass("has-focus");
            }).on("blur", function () {
                $input.removeClass("has-focus");
            });
        });
        self.uploadReview = function () {
            if (self.fileData()) {
                if (self.fileData().properties === undefined) {
                    rootParams.baseModel.showMessages(null, [self.nls.headings.noFileFoundErrorMessage], "INFO");
                    return;
                }
                if (self.fileData().properties.size <= 0) {
                    rootParams.baseModel.showMessages(null, [self.nls.headings.emptyFileErrorMsg], "INFO");
                    $(".input-file").next("label").html(self.nls.fieldname.uploadFile);
                    self.fileData().properties = undefined;
                    return;
                }
            } else {
                rootParams.baseModel.showMessages(null, [self.nls.headings.noFileFoundErrorMessage], "INFO");
                return;
            }
            rootParams.dashboard.loadComponent("review-atm-branch-upload", { file: self.fileData() }, self);
        };
        self.downloadFile = function () {
            LocationUploadModel.fetchPDF(self.recordId());
        };
        self.confirmForUpload = function () {
            if (self.fileData()) {
                if (self.fileData().properties.size > 1048576) {
                    rootParams.baseModel.showMessages(null, [self.nls.headings.fileSizeErrorMsg], "INFO");
                    return;
                }
                LocationUploadModel.uploadDocument(self.fileData().properties, self.selectedType().toUpperCase()).done(function (data, status, jqXhr) {
                    self.recordId(data.recordId);
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.nls.headings.transactionName,
                        template: "admin/location-confirm-screen"
                    }, self);
                });
            }
        };
    };
});