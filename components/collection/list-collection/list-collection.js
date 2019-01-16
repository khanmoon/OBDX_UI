define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/list-collection",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojtable"
], function (oj, ko, $, ListCollectionModel, locale) {
    "use strict";
    return function (params) {
        var self = this;
        self.componentId = ko.observable();
        self.mode = ko.observable();
        self.templateList = ko.observableArray();
        self.draftList = ko.observableArray();
        self.dataSourceCreatedForDraft = ko.observable(false);
        self.dataSourceCreatedForTemplate = ko.observable(false);
        self.dataSource = ko.observableArray();
        self.dataSourceForTemplate = ko.observableArray();
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = locale;
        params.dashboard.headerName(self.resourceBundle.heading.collectionInitiation);
        self.updateTemplate = ko.observable(false);
        self.updateDraft = ko.observable(false);
        params.baseModel.registerComponent("initiate-collection", "collection");
        params.baseModel.registerComponent("collection-nav-bar", "collection");
        params.baseModel.registerElement("search-box");
        self.collectionDetails = ko.observable();
        function capitalize(string) {
            if (string) {
                return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
            }
        }
        self.getTemplates = function () {
            ListCollectionModel.getTemplates().done(function (data) {
                self.templateList.removeAll();
                data.billDTOs = params.baseModel.sortLib(data.billDTOs, ["lastUpdatedDate"], ["desc"]);
                for (var i = 0; i < data.billDTOs.length; i++) {
                    self.templateList.push({
                        template_name: data.billDTOs[i].name,
                        beneficiary: data.billDTOs[i].counterPartyName,
                        product: data.billDTOs[i].productName,
                        customer_id: data.billDTOs[i].userName,
                        created_on: params.baseModel.formatDate(data.billDTOs[i].applicationDate),
                        updated_on: params.baseModel.formatDate(data.billDTOs[i].lastUpdatedDate),
                        access_type: capitalize(data.billDTOs[i].visibility),
                        templateId: data.billDTOs[i].id
                    });
                }
                self.dataSourceForTemplate(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.templateList(), { idAttribute: ["templateId"] })));
                self.dataSourceCreatedForTemplate(true);
            });
        };
        self.onTemplateNameSelected = function (data) {
            ListCollectionModel.getTemplateById(data.templateId).done(function (data) {
                var dataToBePassed = data.bill;
                if (dataToBePassed.currentUser) {
                    self.updateTemplate(true);
                } else {
                    self.updateTemplate(false);
                }
                var filterValues = {
                    paymentType: data.billProductDto.tenorCode,
                    docAttached: data.billProductDto.docAttached.toString(),
                    lcLinked: data.billProductDto.lcLinkage.toString()
                };
                var parameters = {
                    mode: "EDIT",
                    collectionDetails: dataToBePassed,
                    filterDetails: filterValues
                };
                params.dashboard.loadComponent("initiate-collection", parameters, self);
            });
        };
        self.getDrafts = function () {
            ListCollectionModel.getDrafts().done(function (data) {
                self.draftList.removeAll();
                data.billDTOs = params.baseModel.sortLib(data.billDTOs, ["lastUpdatedDate"], ["desc"]);
                for (var i = 0; i < data.billDTOs.length; i++) {
                    self.draftList.push({
                        draft_name: data.billDTOs[i].name,
                        created_on: params.baseModel.formatDate(data.billDTOs[i].lastUpdatedDate),
                        draftId: data.billDTOs[i].id
                    });
                }
                self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.draftList(), { idAttribute: ["draft_name"] })));
                self.dataSourceCreatedForDraft(true);
            });
        };
        self.setComponentId = function (id) {
            self.componentId(id);
            self.dataSourceCreatedForDraft(false);
            self.dataSourceCreatedForTemplate(false);
            if (self.componentId() === "TEMPLATES") {
                self.getTemplates();
            } else {
                self.getDrafts();
            }
        };
        self.onDraftSelected = function (data) {
            ListCollectionModel.getDraftById(data.draftId).done(function (data) {
                var dataToBePassed = data.bill;
                var filterValues = {
                    paymentType: data.billProductDto.tenorCode,
                    docAttached: data.billProductDto.docAttached ? data.billProductDto.docAttached.toString() : "false",
                    lcLinked: data.billProductDto.lcLinkage ? data.billProductDto.lcLinkage.toString() : "false"
                };
                self.updateDraft(true);
                var parameters = {
                    mode: "EDIT",
                    collectionDetails: dataToBePassed,
                    filterDetails: filterValues
                };
                params.dashboard.loadComponent("initiate-collection", parameters, self);
            });
        };
    };
});
