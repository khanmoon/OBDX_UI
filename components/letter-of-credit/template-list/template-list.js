define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/letter-of-credit-search",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojtable"
], function (oj, ko, $, TemplateModel, resourceBundle) {
    "use strict";
    return function (params) {
        var i, self = this;
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        self.dataSourceCreated = ko.observable(false);
        self.templateDatasource = ko.observableArray().extend({ loaded: false });
        self.templateList = ko.observableArray();
        params.baseModel.registerElement("search-box");
        self.mode = ko.observable("TEMPLATE");
        self.updateTemplate = ko.observable(false);
        params.dashboard.headerName(self.resourceBundle.heading.initiateLC);
        self.letterOfCreditDetails = ko.observable();
        function capitalize(string) {
            if (string) {
                return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
            }
        }
        self.getTemplates = function () {
            TemplateModel.getTemplates().done(function (data) {
                self.templateList.removeAll();
                data.letterOfCreditDTOs = params.baseModel.sortLib(data.letterOfCreditDTOs, ["lastUpdatedDate"], ["desc"]);
                for (i = 0; i < data.letterOfCreditDTOs.length; i++) {
                    self.templateList.push({
                        template_name: data.letterOfCreditDTOs[i].name,
                        beneficiary: data.letterOfCreditDTOs[i].counterPartyName,
                        product: data.letterOfCreditDTOs[i].productName,
                        customer_id: data.letterOfCreditDTOs[i].userName,
                        created_on: params.baseModel.formatDate(data.letterOfCreditDTOs[i].applicationDate),
                        updated_on: params.baseModel.formatDate(data.letterOfCreditDTOs[i].lastUpdatedDate),
                        access_type: capitalize(data.letterOfCreditDTOs[i].visibility),
                        templateId: data.letterOfCreditDTOs[i].id
                    });
                }
                self.templateDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.templateList(), { idAttribute: ["template_name"] })));
                self.dataSourceCreated(true);
            });
        };
        self.getTemplates();
        self.onTemplateNameSelected = function (selectedData) {
            TemplateModel.getTemplate(selectedData.templateId).done(function (data) {
                var dataToBePassed = data.letterOfCredit;
                if (dataToBePassed.draftsRequired) {
                    for (i = 0; i < dataToBePassed.billingDrafts.length; i++) {
                        if (!dataToBePassed.billingDrafts[i].otherInformation)
                            dataToBePassed.billingDrafts[i].otherInformation = null;
                    }
                }
                if (dataToBePassed.currentUser) {
                    self.updateTemplate(true);
                } else {
                    self.updateTemplate(false);
                }
                var parameters = {
                    mode: "EDIT",
                    letterOfCreditDetails: dataToBePassed
                };
                params.dashboard.loadComponent("initiate-lc", parameters, self);
            });
        };
    };
});