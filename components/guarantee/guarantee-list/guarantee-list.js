define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/guarantee-list",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojtable"
], function (oj, ko, $, listGuaranteeModel, locale) {
    "use strict";
    return function (params) {
        var self = this;
        self.componentId = ko.observable("TEMPLATES");
        self.mode = ko.observable();
        self.dataSourceCreatedForTemplate = ko.observable(false);
        self.dataSourceCreatedForDraft = ko.observable(false);
        self.dataSource = ko.observable();
        self.dataSourceForTemplate = ko.observable();
        self.templateList = ko.observableArray();
        self.draftList = ko.observableArray();
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = locale;
        self.updateTemplate = ko.observable(false);
        self.updateDraft = ko.observable(false);
        params.dashboard.headerName(self.resourceBundle.heading.initiateGuarantee);
        params.baseModel.registerComponent("initiate-guarantee", "guarantee");
        params.baseModel.registerComponent("guarantee-nav-bar", "guarantee");
        params.baseModel.registerElement("search-box");
        self.getTemplates = function () {
            listGuaranteeModel.getTemplates().done(function (data) {
                self.templateList.removeAll();
                data.bankGuaranteeDTO = params.baseModel.sortLib(data.bankGuaranteeDTO, ["lastUpdatedDate"], ["desc"]);
                for (var i = 0; i < data.bankGuaranteeDTO.length; i++) {
                    self.templateList.push({
                        template_name: data.bankGuaranteeDTO[i].name,
                        beneficiary: data.bankGuaranteeDTO[i].beneName,
                        product: data.bankGuaranteeDTO[i].productName,
                        customer_id: data.bankGuaranteeDTO[i].userName,
                        updated_on: params.baseModel.formatDate(data.bankGuaranteeDTO[i].lastUpdatedDate),
                        access_type: self.resourceBundle.templates.labels[data.bankGuaranteeDTO[i].visibility],
                        templateId: data.bankGuaranteeDTO[i].bgId
                    });
                }
                self.dataSourceForTemplate(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.templateList, { idAttribute: ["template_name"] })));
                self.dataSourceCreatedForTemplate(true);
            });
        };
        self.onTemplateNameSelected = function (data) {
            listGuaranteeModel.getTemplateById(data.templateId).done(function (data) {
                var dataToBePassed = data.bankGuarantee;
                if (dataToBePassed.currentUser) {
                    self.updateTemplate(true);
                } else {
                    self.updateTemplate(false);
                }
                var parameters = {
                    mode: "EDIT",
                    guaranteeDetails: dataToBePassed
                };
                params.dashboard.loadComponent("initiate-guarantee", parameters, self);
            });
        };
        self.getDrafts = function () {
            listGuaranteeModel.getDrafts().done(function (data) {
                self.draftList.removeAll();
                data.bankGuaranteeDTO = params.baseModel.sortLib(data.bankGuaranteeDTO, ["lastUpdatedDate"], ["desc"]);
                for (var i = 0; i < data.bankGuaranteeDTO.length; i++) {
                    self.draftList.push({
                        draft_name: data.bankGuaranteeDTO[i].name,
                        created_on: params.baseModel.formatDate(data.bankGuaranteeDTO[i].lastUpdatedDate),
                        draftId: data.bankGuaranteeDTO[i].bgId
                    });
                }
                self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.draftList(), { idAttribute: ["draft_name"] })));
                self.dataSourceCreatedForDraft(true);
            });
        };
        self.onDraftSelected = function (data) {
            listGuaranteeModel.getDraftById(data.draftId).done(function (data) {
                var dataToBePassed = data.bankGuarantee;
                self.updateDraft(true);
                var parameters = {
                    mode: "EDIT",
                    guaranteeDetails: dataToBePassed
                };
                params.dashboard.loadComponent("initiate-guarantee", parameters, self);
            });
        };
        self.setComponentId = function (id) {
            self.componentId(id);
            self.dataSourceCreatedForTemplate(false);
            self.dataSourceCreatedForDraft(false);
            if (self.componentId() === "TEMPLATES") {
                self.getTemplates();
            } else {
                self.getDrafts();
            }
        };
    };
});
