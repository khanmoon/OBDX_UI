define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/image-upload",
    "ojs/ojknockout"
], function (oj, ko, $, model, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.file = rootParams.file;
        self.target = rootParams.imageId;
        self.input = rootParams.fileId;
        self.previewImage = rootParams.preview;
        self.contentId = ko.observable();
        self.label = rootParams.label;
        self.nls = locale;
        self.imageUpload = ko.observable(rootParams.imageUploaded ? rootParams.imageUploaded() : true);
        self.maxFileSize = ko.observable(self.nls.maxSize / 1000);
        var fileTypeArray = ko.observableArray();
        fileTypeArray.push("image/jpeg");
        fileTypeArray.push("image/png");
        self.template = rootParams.template ? rootParams.template : null;
        rootParams.baseModel.registerComponent("file-input", "file-upload");
        function readURL() {
            if (self.file()) {
                if (!(fileTypeArray().indexOf(self.file().type) > -1)) {
                    rootParams.baseModel.showMessages(null, [self.nls.fileTypeError], "INFO");
                    self.file("");
                    document.getElementById(self.input()).value = "";
                    return;
                }
                if (self.file().size <= 0) {
                    rootParams.baseModel.showMessages(null, [self.nls.emptyFileErrorMsg], "INFO");
                    self.file("");
                    document.getElementById(self.input()).value = "";
                    return;
                } else if (self.file().size > self.maxFileSize() * 1000) {
                    rootParams.baseModel.showMessages(null, [rootParams.baseModel.format(self.nls.fileSizeErrorMsg, { fileSize: self.maxFileSize() })], "INFO");
                    self.file("");
                    document.getElementById(self.input()).value = "";
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (e) {
                    self.previewImage(e.target.result);
                    $("#"+self.target()).attr("src", e.target.result);
                };
                reader.readAsDataURL(self.file());
                self.imageUpload(false);
            }
        }
        var imageFunction = function () {
            self.file(document.getElementById(self.input()).files[0]);
            readURL(this);
        };
        self.afterRender = function () {
            $("#"+self.input()).change(imageFunction);
        };
        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
            rootParams.baseModel.showMessages(null, [self.nls.alertMessage], "INFO");
        }
        function handleFileSelect(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var files = evt.dataTransfer.files;
            var targetId = evt.currentTarget.id.split("_")[1];
            if(self.input() === targetId) {
                for (var i = 0; i < files.length; i++) {
                    self.file(files[i]);
                    readURL(this);
                }
            }
        }
        function handleDragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = "copy";
        }
        function addListner() {
            var dropZone = document.getElementsByClassName("uploadImage-fileUpload");
            for (var i = 0; i < dropZone.length; i++) {
                dropZone[i].addEventListener("dragover", handleDragOver, false);
                dropZone[i].addEventListener("drop", handleFileSelect, false);
            }
        }
        addListner();
        self.uploadImage = function () {
            var form = new FormData();
            form.append("file", self.file());
            model.uploadImage(form).done(function (data) {
                if (data && data.contentDTOList[0] && data.contentDTOList[0].contentId) {
                    self.contentId(data.contentDTOList[0].contentId.value);
                }
            });
        };
        self.retrieveImage = function () {
            model.retrieveImage(self.contentId()).done(function (data) {
                if (data && data.contentDTOList[0]) {
                    $("#"+self.target()).attr("src", "data:image/gif;base64," + data.contentDTOList[0].content);
                }
            });
        };
        self.removePreviewImage = function () {
            self.imageUpload(true);
            $("#"+self.target()).attr("src", "");
            self.file("");
            ko.tasks.runEarly();
            document.getElementById(self.input()).value = "";
            addListner();
        };
        self.remove = function () {
            model.deleteImage(self.contentId()).done(function () {
                $("#"+self.target()).attr("src", "");
            });
        };
    };
});
