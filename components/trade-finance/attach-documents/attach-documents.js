define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/view-letter-of-credit",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox"
], function (oj, ko, $, AttachDocumentModel, resourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        params.baseModel.registerComponent("file-input", "file-upload");
        self.attachDocResourceBundle = resourceBundle;
        self.attachDocList = params.attachDocList;
        self.deletedDocList = params.deletedDocList;
        self.allowAttachments = params.allowAttachments;
        self.contractModified = params.contractModified;
        self.mode = params.mode;
        self.categoryOptions = ko.observableArray();
        self.categoryTypeOptions = ko.observableArray();
        self.docType = ko.observable();
        self.docCategory = ko.observable();
        self.docRemarks = ko.observable();
self.attachDocTblColumns=null;
        if (self.mode() === "CREATE" || self.mode() === "EDIT") {
            self.attachDocTblColumns = [
                { headerText: self.attachDocResourceBundle.lcDetails.labels.srNo },
                { headerText: self.attachDocResourceBundle.documents.labels.docId },
                { headerText: self.attachDocResourceBundle.documents.labels.docCategory },
                { headerText: self.attachDocResourceBundle.documents.labels.docType },
                { headerText: self.attachDocResourceBundle.documents.labels.remarks },
                {
                    headerText: self.attachDocResourceBundle.documents.labels.remove,
                    headerClassName: "right",
                    className: "right"
                }
            ];
        } else {
            self.attachDocTblColumns = [
                { headerText: self.attachDocResourceBundle.lcDetails.labels.srNo },
                { headerText: self.attachDocResourceBundle.documents.labels.docId },
                { headerText: self.attachDocResourceBundle.documents.labels.docCategory },
                { headerText: self.attachDocResourceBundle.documents.labels.docType },
                { headerText: self.attachDocResourceBundle.documents.labels.remarks }
            ];
        }
        self.attachedDocumentsValidationTracker = ko.observable();
        self.datasourceForAttachDocument = new oj.ArrayTableDataSource(self.attachDocList, { idAttribute: "contentId" });
        AttachDocumentModel.fetchCategory().done(function (categoryData) {
            var categoryTypeList = categoryData.documentCategoryDTOList;
            var categoryList = [];
            if (categoryTypeList) {
                for (var i = 0; i < categoryTypeList.length; i++) {
                    categoryList.push({
                        value: categoryTypeList[i].category,
                        label: categoryTypeList[i].category,
                        categoryTypes: categoryTypeList[i].type
                    });
                }
                self.categoryOptions(categoryList);
            }
        });
        self.categoryChangeHandler = function (event) {
            if (event.detail.value) {
                var selectedCategory = event.detail.value;
                var typeList = [];
                self.categoryTypeOptions.removeAll();
                for (var i = 0; i < self.categoryOptions().length; i++) {
                    if (self.categoryOptions()[i].value === selectedCategory) {
                        for (var j = 0; j < self.categoryOptions()[i].categoryTypes.length; j++) {
                            typeList.push({
                                value: self.categoryOptions()[i].categoryTypes[j].type,
                                label: self.categoryOptions()[i].categoryTypes[j].type
                            });
                        }
                        break;
                    }
                }
                self.categoryTypeOptions(typeList);
            }
        };
        self.uploadDocs = function () {
            $("#uploadDocs").trigger("openModal");
        };
        self.upload = function () {
            if (!params.baseModel.showComponentValidationErrors(self.attachedDocumentsValidationTracker())) {
                return;
            }
            if (document.getElementById("documentInput") !== null && document.getElementById("documentInput").files.length > 0) {
                var file;
                var tempIndex = 0;
                for (var k = 0; k < document.getElementById("documentInput").files.length; k++) {
                    file = document.getElementById("documentInput").files[k];
                    var formData = new FormData();
                    formData.append("file", file);
                    formData.append("transactionType", "LC");
                    formData.append("moduleIdentifier", "LC_DOC_ATTACHMENT");
                    formData.append("fileCount", self.attachDocList().length + k + 1);
                    AttachDocumentModel.uploadDocument(formData).done(function (data) {
                        if (data.contentDTOList.length > 0 && data.contentDTOList[0].contentId) {
                            self.attachDocList.push({
                                contentId: data.contentDTOList[0].contentId,
                                documentName: data.contentDTOList[0].title,
                                category: self.docCategory(),
                                type: self.docType(),
                                remarks: self.docRemarks(),
                                newDocument: true
                            });
                        }
                        tempIndex++;
                        if (tempIndex === document.getElementById("documentInput").files.length) {
                            document.getElementById("documentInput").value = null;
                            document.getElementById("documentInput").nextElementSibling.innerHTML = self.attachDocResourceBundle.generic.common.fileInput.chooseFile;
                            self.docCategory([]);
                            self.docType([]);
                            self.docRemarks(null);
                            $("#uploadDocs").hide();
                        }
                    });
                }
            } else {
                params.baseModel.showMessages(null, [self.attachDocResourceBundle.tradeFinanceErrors.messages.noFileSelected], "ERROR");
            }
            if (self.mode() === "VIEW") {
                self.contractModified(true);
            }
        };
        self.getRowId = function (rowIndex) {
            return ++rowIndex;
        };
        function findIndexInData(data, property, value) {
            for (var i = 0; i < data.length; i++) {
                if (data[i][property].value === value) {
                    return i;
                }
            }
            return -1;
        }
        self.fadeOutWarningContainer = function(){
            $("#warning-container").fadeOut("slow");
        };
        self.hideUploadDocs = function(){
            $("#uploadDocs").hide();
        };
        self.deleteDocument = function (documentData) {
            if (self.mode() === "VIEW") {
                if (documentData.newDocument === false) {
                    self.deletedDocList.push(documentData);
                }
                self.contractModified(true);
            } else {
                self.deletedDocList.push(documentData);
            }
            var index = findIndexInData(self.attachedDocuments(), "contentId", documentData.contentId.value);
            self.attachDocList.splice(index, 1);
        };
        self.downloadDocument = function (docId) {
            AttachDocumentModel.fetchDocumentsByteArray(docId);
        };
    };
});
