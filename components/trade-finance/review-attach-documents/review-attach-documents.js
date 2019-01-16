define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/view-letter-of-credit",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojvalidation",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojnavigationlist",
    "ojs/ojdatetimepicker",
    "ojs/ojconveyorbelt",
    "ojs/ojradioset",
    "ojs/ojswitch",
    "ojs/ojlistview",
    "ojs/ojpagingcontrol"
], function (oj, ko, $, ReviewAttachDocModel, resourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.attachDocResourceBundle = resourceBundle;
        self.datasourceForAttachDocument = ko.observableArray();
        self.datasourceForDeletedDocument = ko.observableArray();
        self.moduleName = ko.observable();
        self.moduleId = ko.observable();
self.attachDocTblColumns=null;
        self.attachDocTblColumns = [
            { headerText: self.attachDocResourceBundle.lcDetails.labels.srNo },
            { headerText: self.attachDocResourceBundle.documents.labels.docId },
            { headerText: self.attachDocResourceBundle.documents.labels.docCategory },
            { headerText: self.attachDocResourceBundle.documents.labels.docType },
            { headerText: self.attachDocResourceBundle.documents.labels.remarks }
        ];
        self.modifyContractDetails = self.params.data;
        if (self.modifyContractDetails.lcId) {
            self.moduleName(self.attachDocResourceBundle.labels.lcNumber);
            self.moduleId(self.modifyContractDetails.lcId());
        } else if (self.modifyContractDetails.bgId) {
            self.moduleName(self.attachDocResourceBundle.labels.bgNumber);
            self.moduleId(self.modifyContractDetails.bgId());
        }
        if (self.modifyContractDetails.attachedDocuments) {
            self.datasourceForAttachDocument(new oj.ArrayTableDataSource(self.modifyContractDetails.attachedDocuments()));
        }
        if (self.modifyContractDetails.deletedDocuments) {
            self.datasourceForDeletedDocument(new oj.ArrayTableDataSource(self.modifyContractDetails.deletedDocuments()));
        }
        self.getRowId = function (rowIndex) {
            return ++rowIndex;
        };
        self.downloadDocument = function (docId) {
            ReviewAttachDocModel.fetchDocumentsByteArray(docId);
        };
    };
});
