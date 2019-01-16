define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!resources/nls/application-documents",
  "ojs/ojfilepicker",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource"
], function(oj, ko, $, DocumentUploadModel, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    var categoryIndex, documentIndex, submissionDocumentIndex;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.dataLoaded = ko.observable(false);
    self.documentCategories = ko.observable("");
    rootParams.baseModel.registerElement("file-input");
    self.isDocumentName = ko.observable(false);
    self.acceptStr = ko.observable("image/*");
    self.documentName = ko.observable("");
    self.anyDocumentUploaded = ko.observable(false);
    self.uploadDocumentDeferredObjs = [];
    self.uploadedDocumentDetails = [];
    var uploadedDocumentCount = 0;
    self.acceptArr = ko.pureComputed(function() {
      var accept = self.acceptStr();
      return accept ? accept.split(",") : [];
    }, self);
    self.fileSelectListener = function(documentIndex, documentCategoryIndex, event) {
      var files = event.detail.files;
      for (var i = 0; i < files.length; i++) {
        var index = self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray.push({
          "document": files[i].name,
          "iconDelete": "icon-delete",
          "file": files[i]
        });
        self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray()[index - 1].remarks = ko.observable("");
      }
      self.documentCategories()[documentCategoryIndex].type[documentIndex].anyDocumentUploaded(true);
    };
    var searchCategoryOrDocumentIndex = function(documentCategoryKey, arrayObj, property) {
      for (var i = 0; i < arrayObj.length; i++) {
        if (documentCategoryKey === arrayObj[i][property]) {
          return i;
        }
      }
    };
    var searchCategoryDocumentIndex = function(contentId, documentCategory, documentType, arrayObj) {
      for (var i = 0; i < arrayObj.length; i++) {
        if (documentCategory === arrayObj[i].categoryId && documentType === arrayObj[i].documentType && contentId === arrayObj[i].contentId.value) {
          return i;
        }
      }
    };

    self.columnsArray = [{
      "headerText": self.resource.documentLabel,
      "renderer": oj.KnockoutTemplateUtils.getRenderer("document_template", true),
      "field": "document"
    }, {
      "headerText": self.resource.remarks,
      "renderer": oj.KnockoutTemplateUtils.getRenderer("remarks_template", true),
      "field": "remarks"
    }, {
      "headerText": self.resource.action,
      "renderer": oj.KnockoutTemplateUtils.getRenderer("action_template", true),
      "field": "iconDelete"
    }];

    var order = 0,
      documentTypeOrder = 0;
    DocumentUploadModel.fetchDocumentChecklist(self.productDetails().submissionId.value, self.applicantDetails()[0].applicantId().value, self.productDetails().productType).done(function(data) {
      self.documentCategories(data.documentCategoryDTOList);
      if (self.documentCategories()) {
        for (var i = self.documentCategories().length - 1; i >= 0; i--) {
          if (self.documentCategories()[i].type.length === 0) {
            self.documentCategories().splice(i, 1);
          }
          self.documentCategories()[i].order = 10000;
          for (var j = 0; j < self.documentCategories()[i].type.length; j++) {
            self.documentCategories()[i].type[j].showProcessing = ko.observable(false);
            self.documentCategories()[i].type[j].anyDocumentUploaded = ko.observable(false);
            self.documentCategories()[i].type[j].remarks = "";
            self.documentCategories()[i].type[j].attachedDocumentsArray = ko.observableArray([]);
            self.documentCategories()[i].type[j].order = 10000;
            self.documentCategories()[i].type[j].dataSource = new oj.ArrayTableDataSource(self.documentCategories()[i].type[j].attachedDocumentsArray, {
              idAttribute: "document"
            });
            if (self.documentCategories()[i].type[j].mandatory) {
              self.documentCategories()[i].order = order;
              self.documentCategories()[i].type[j].order = documentTypeOrder;
              order++;
              documentTypeOrder++;
            }
          }
          self.documentCategories()[i].type.sort(function(left, right) {
            if (left.order < right.order)
              return -1;
            if (left.order > right.order)
              return 1;
            return 0;
          });
        }
        self.documentCategories().sort(function(left, right) {
          if (left.order < right.order)
            return -1;
          if (left.order > right.order)
            return 1;
          return 0;
        });
        self.dataLoaded(true);
      }
      DocumentUploadModel.fetchUploadedDocuments(self.productDetails().submissionId.value).done(function(data) {
        if (data.submissionDocument && data.submissionDocument.length > 0) {
          for (var i = 0; i < data.submissionDocument.length; i++) {
            categoryIndex = searchCategoryOrDocumentIndex(data.submissionDocument[i].categoryId, self.documentCategories(), "category");
            documentIndex = searchCategoryOrDocumentIndex(data.submissionDocument[i].documentType, self.documentCategories()[categoryIndex].type, "type");
            self.documentCategories()[categoryIndex].type[documentIndex].attachedDocumentsArray.push({
              "document": data.submissionDocument[i].documentName,
              "remarks": data.submissionDocument[i].remark ? data.submissionDocument[i].remark : "",
              "iconDelete": "icon-delete",
              "file": "",
              "uploaded": true,
              "contentId": data.submissionDocument[i].contentId
            });
            self.documentCategories()[categoryIndex].type[documentIndex].anyDocumentUploaded(true);
          }
        }
      });
    });
    self.applicantSelectedHandler = function(event) {
      if (event.detail.value) {
        for (var applicantIndex = 0; applicantIndex < self.documentCategories().length; applicantIndex++) {
          self.documentCategories()[applicantIndex].showDocuments(false);
        }
        self.documentCategories()[event.detail.value].showDocuments(true);
      }
    };
    self.downloadDocument = function(contentId) {
      DocumentUploadModel.downloadDocument(contentId.value, self.applicantDetails()[0].applicantId().value);
    };
    self.deleteDocument = function(documentCategoryIndex, documentIndex, rowIndex) {
      if (self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray()[rowIndex].uploaded && JSON.parse(self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray()[rowIndex].uploaded)) {
        var contentId = self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray()[rowIndex].contentId;
        DocumentUploadModel.deleteDocument(contentId.value).done(function() {
          DocumentUploadModel.deleteLocalDocument(self.productDetails().submissionId.value, contentId.value).done(function() {
            self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray.splice(rowIndex, 1);
            if (self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray().length === 0) {
              self.documentCategories()[documentCategoryIndex].type[documentIndex].anyDocumentUploaded(false);
            }
          });
        });
      } else {
        self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray.splice(rowIndex, 1);
        if (self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray().length === 0) {
          self.documentCategories()[documentCategoryIndex].type[documentIndex].anyDocumentUploaded(false);
        }
      }
    };
    self.documentUploadContinue = function() {
      var i, j, k, l;
      var upload = false;
      for (i = 0; i < self.documentCategories().length; i++) {
        for (j = 0; j < self.documentCategories()[i].type.length; j++) {
          for (k = 0; k < self.documentCategories()[i].type[j].attachedDocumentsArray().length; k++) {
            self.uploadDocument(i, j, k);
            upload = true;
          }
        }
      }
      if (!upload) {
        $("#NOFILE").trigger("openModal");
      }
      Promise.all(self.uploadDocumentDeferredObjs).then(function() {
        DocumentUploadModel.fetchUploadedDocuments(self.productDetails().submissionId.value).done(function(data) {
          if (data.submissionDocument && data.submissionDocument.length > 0) {
            for (l = 0; l < self.uploadedDocumentDetails.length; l++) {
              self.documentCategories()[self.uploadedDocumentDetails[l].documentCategoryIndex].type[self.uploadedDocumentDetails[l].documentIndex].attachedDocumentsArray.splice(self.uploadedDocumentDetails[l].tableRowIndex, 1);
              submissionDocumentIndex = searchCategoryDocumentIndex(self.uploadedDocumentDetails[l].contentId.value, self.documentCategories()[self.uploadedDocumentDetails[l].documentCategoryIndex].category, self.documentCategories()[self.uploadedDocumentDetails[l].documentCategoryIndex].type[self.uploadedDocumentDetails[l].documentIndex].type, data.submissionDocument);
              self.documentCategories()[self.uploadedDocumentDetails[l].documentCategoryIndex].type[self.uploadedDocumentDetails[l].documentIndex].attachedDocumentsArray.splice(self.uploadedDocumentDetails[l].tableRowIndex, 0, {
                "document": data.submissionDocument[submissionDocumentIndex].documentName,
                "remarks": data.submissionDocument[submissionDocumentIndex].remark ? data.submissionDocument[submissionDocumentIndex].remark : "",
                "iconDelete": "icon-delete",
                "file": "",
                "uploaded": true,
                "contentId": data.submissionDocument[submissionDocumentIndex].contentId
              });
              self.documentCategories()[self.uploadedDocumentDetails[l].documentCategoryIndex].type[self.uploadedDocumentDetails[l].documentIndex].anyDocumentUploaded(true);
            }
            if (self.productDetails().sectionBeingEdited() === "document-upload" && self.documentsUploaded && ko.isObservable(self.documentsUploaded)) {
              self.documentsUploaded(data.submissionDocument);
            }
            self.uploadedDocumentDetails = [];
            uploadedDocumentCount = 0;
            self.uploadDocumentDeferredObjs = [];
          }
        });
      });
    };
    self.cancelApplicationFromDocument = function() {
      self.previousPluginComponent("document-upload");
      self.showPluginComponent("cancel-application");
    };
    self.uploadDocument = function(documentCategoryIndex, documentIndex, tableRowIndex) {
      var file = self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray()[tableRowIndex].file;
      if (!file) {
        return;
      }
      self.documentCategories()[documentCategoryIndex].type[documentIndex].showProcessing(true);
      var checkListId = self.documentCategories()[documentCategoryIndex].type[documentIndex].checklistId;
      var documentCategoryId = self.documentCategories()[documentCategoryIndex].type[documentIndex].docCategoryId;
      var documentNature = self.documentCategories()[documentCategoryIndex].type[documentIndex].documentNature;
      $("#" + JSON.stringify(documentCategoryIndex) + JSON.stringify(documentIndex) + "-document-upload").val("");
      ko.tasks.runEarly();
      $("#" + JSON.stringify(documentCategoryIndex) + JSON.stringify(documentIndex) + "-document-upload").next("label").html(self.resource.chooseFile);
      var formData = new FormData();
      formData.append("file", file);
      formData.append("documentChecklistId", checkListId);
      formData.append("documentTypeId", checkListId);
      formData.append("documentCategoryId", documentCategoryId);
      formData.append("documentNatureType", documentNature);
      formData.append("transactionType", "OR");
      formData.append("moduleIdentifier", "ORIGINATION");
      var uploadDocumentDeferred = $.Deferred();
      self.uploadDocumentDeferredObjs.push(uploadDocumentDeferred);
      DocumentUploadModel.uploadDocument(formData).done(function(data) {
        var contentId = data.contentDTOList[0].contentId;
        var payload = {
          contentId: contentId.value,
          categoryId: self.documentCategories()[documentCategoryIndex].category,
          documentType: self.documentCategories()[documentCategoryIndex].type[documentIndex].type,
          documentName: file.name
        };
        if (self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray()[tableRowIndex].remarks && ko.isObservable(self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray()[tableRowIndex].remarks)) {
          payload.remark = self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray()[tableRowIndex].remarks();
        }
        DocumentUploadModel.saveDocument(self.productDetails().submissionId.value, contentId.value, ko.toJSON(payload)).done(function() {
          self.documentCategories()[documentCategoryIndex].type[documentIndex].showProcessing(false);
          self.uploadedDocumentDetails[uploadedDocumentCount++] = {
            documentCategoryIndex: documentCategoryIndex,
            documentIndex: documentIndex,
            tableRowIndex: tableRowIndex,
            contentId: contentId
          };
          uploadDocumentDeferred.resolve();
        });
      }).fail(function() {
        self.documentCategories()[documentCategoryIndex].type[documentIndex].showProcessing(false);
      });
    };
  };
});
