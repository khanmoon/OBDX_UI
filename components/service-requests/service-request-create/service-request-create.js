define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "ojL10n!resources/nls/service-request-create",
  "ojs/ojvalidationgroup",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojselectcombobox",
  "ojs/ojswitch"
], function (oj, ko, $, ServiceRequestCreate, BaseLogger, resourceBundle) {
  "use strict";
  return function (params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    self.showAddButton = ko.observable(false);
    self.showAddNewProduct = ko.observable(false);
    self.requestName = ko.observable();
    self.requestDescription = ko.observable();
    self.moduleName = ko.observable();
    self.transactionType = ko.observable();
    self.requestType = ko.observable();
    self.requestCategoryName = ko.observable();
    self.applicableStatus = ko.observable();
    self.severity = ko.observable();
    self.activationStatus = ko.observable();
    self.categoryData = ko.observableArray();
    self.categoryTypesLoaded = ko.observable(false);
    self.transactionTypesLoaded = ko.observable(false);
    self.moduleData = ko.observableArray();
    self.moduleTypesLoaded = ko.observable(false);
    self.transactionTypeData = ko.observableArray();
    self.severityData = ko.observableArray();
    self.severityLoaded = ko.observable(false);
    self.statusesData = ko.observableArray();
    self.statusesLoaded = ko.observable(false);
    self.groupValid = ko.observable();
    var tracker;
    params.baseModel.registerElement("modal-window");
    params.dashboard.headerName(self.resource.serviceRequestCreateHeader);
    var i;
    self.showAddNew = function () {
      self.showAddButton(true);
    };
    self.addNewProduct = function () {
      self.showAddNewProduct(true);
    };
    self.onBack = function () {
      params.baseModel.registerComponent("service-requests-search", "service-requests");
      params.dashboard.loadComponent("service-requests-search", {}, self);
    };
    self.postFetchCategoryTypes = function (data) {
      self.categoryTypesLoaded(false);
      self.categoryData.removeAll();
      for (i = 0; i < data.categoryResponse.length; i++) {
        self.categoryData.push({
          label: data.categoryResponse[i].categoryName
        });
      }
      ko.tasks.runEarly();
      self.categoryTypesLoaded(true);
    };
    self.addSRProduct = function () {
      var prodtracker = document.getElementById("requestProductNameHint");
      var productValid = prodtracker.valid;
      if (productValid === "valid") {
        var saveData = ko.toJSON({
          productName: self.newProductName()
        });
        ServiceRequestCreate.addSRProduct(saveData).done(function () {
          ServiceRequestCreate.fetchModuleTypes().done(function (data) {
            self.moduleTypesLoaded(false);
            self.moduleData.removeAll();
            for (i = 0; i < data.productResponse.length; i++) {
              self.moduleData.push({
                label: data.productResponse[i].productName,
                code: data.productResponse[i].productName
              });
            }
            ko.tasks.runEarly();
            self.moduleTypesLoaded(true);
            $("#createProduct").trigger("openModal");
            self.showAddNewProduct(false);
            self.newProductName("");
          });
        });
      } else {
        prodtracker.showMessages();
      }
    };
    self.addSRCategory = function () {
      var cattracker = document.getElementById("requestCategoryNameHint");
      var categoryValid = cattracker.valid;
      if (categoryValid === "valid") {
        var saveData = ko.toJSON({
          categoryName: self.newCategoryName()
        });
        ServiceRequestCreate.addSRCategory(self.addModuleType(), saveData).done(function () {
          ServiceRequestCreate.fetchCategoryTypes(self.addModuleType()).done(function (data) {
            self.categoryTypesLoaded(false);
            self.categoryData.removeAll();
            for (i = 0; i < data.categoryResponse.length; i++) {
              self.categoryData.push({
                label: data.categoryResponse[i].categoryName
              });
            }
            ko.tasks.runEarly();
            self.categoryTypesLoaded(true);
            $("#createCategory").trigger("openModal");
            self.showAddButton(false);
            self.newCategoryName("");
          });
        });
      } else {
        cattracker.showMessages();
      }
    };
    self.closePopUp = function () {
      $("#createCategory").hide();
    };
    self.closeProductPopUp = function () {
      $("#createProduct").hide();
    };
    ServiceRequestCreate.fetchModuleTypes().done(function (data) {
      self.moduleTypesLoaded(true);
      for (i = 0; i < data.productResponse.length; i++) {
        self.moduleData.push({
          label: data.productResponse[i].productName,
          code: data.productResponse[i].productName
        });
      }
    });
    ServiceRequestCreate.fetchTransactionTypes().done(function (data) {
      self.transactionTypesLoaded(true);
      for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.transactionTypeData.push({
          label: data.enumRepresentations[0].data[i].description,
          code: data.enumRepresentations[0].data[i].code
        });
      }
    });
    ServiceRequestCreate.fetchStatuses().done(function (data) {
      self.statusesLoaded(true);
      for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.statusesData.push({
          label: data.enumRepresentations[0].data[i].description,
          value: data.enumRepresentations[0].data[i].code
        });
      }
    });
    ServiceRequestCreate.fetchSeverity().done(function (data) {
      self.severityLoaded(true);
      for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.severityData.push({
          label: data.enumRepresentations[0].data[i].description,
          code: data.enumRepresentations[0].data[i].code
        });
      }
    });
    self.showCategoriesList = function (event) {
      if (event.detail) {
        ServiceRequestCreate.fetchCategoryTypes(event.detail.value).done(function (data) {
          self.postFetchCategoryTypes(data);
        });
      } else {
        ServiceRequestCreate.fetchCategoryTypes(event).done(function (data) {
          self.postFetchCategoryTypes(data);
        });
      }
    };
    if (self.SRDefinitionDTO.name) {
      self.addRequestName(self.SRDefinitionDTO.name);
      self.addDescription(self.SRDefinitionDTO.description);
      self.addTransactionType(self.SRDefinitionDTO.transactionType);
      self.isActive(self.SRDefinitionDTO.isActive);
      self.addRequestType(self.SRDefinitionDTO.requestType);
      self.addModuleType(self.SRDefinitionDTO.product);
      self.addApplicableStatus(self.SRDefinitionDTO.allowedStatuses);
      self.addSeverity(self.SRDefinitionDTO.priorityType);
      self.formHeaderName(self.SRDefinitionDTO.form.header);
      self.infoHeaderName(self.SRDefinitionDTO.form.infoNote.header);
      self.InfoData(self.SRDefinitionDTO.form.infoNote.description);
      if (self.SRDefinitionDTO.form.infoNote.icon.value) {
        self.contentId(self.SRDefinitionDTO.form.infoNote.icon.value);
        self.uploadIcon(self.resource.fileUploadSuccessful);
        self.uploadFile(true);
      }
      self.confirmMessageData(self.SRDefinitionDTO.form.confirmMessage);
      self.showCategoriesList(self.SRDefinitionDTO.product);
      self.addCategoryType(self.SRDefinitionDTO.categoryType);
      if (self.confirmMessageData()) {
        self.confirmData(true);
      }
    }
    self.formBuilderScreen();
    var selectedStepValueSubscription = self.selectedStepValue.subscribe(function () {
      self.createRequest();
    });
    self.createRequest = function () {
      tracker = document.getElementById("fbtracker");
      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        return;
      }
      params.rootModel.SRDefinitionDTO.name = self.addRequestName();
      params.rootModel.SRDefinitionDTO.description = self.addDescription();
      params.rootModel.SRDefinitionDTO.priorityType = self.addSeverity();
      params.rootModel.SRDefinitionDTO.product = self.addModuleType();
      params.rootModel.SRDefinitionDTO.requestType = self.addRequestType();
      params.rootModel.SRDefinitionDTO.transactionType = self.addTransactionType();
      params.rootModel.SRDefinitionDTO.categoryType = self.addCategoryType();
      params.rootModel.SRDefinitionDTO.allowedStatuses = self.addApplicableStatus();
      params.rootModel.SRDefinitionDTO.isActive = self.isActive();
    };
    self.loadNextScreen = function () {
      self.createRequest();
      self.nextStep();
    };
    self.dispose = function () {
      selectedStepValueSubscription.dispose();
    };
  };
});