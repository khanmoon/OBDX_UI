define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "ojL10n!resources/nls/service-request-create",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojgauge",
  "ojs/ojselectcombobox"
], function (oj, ko, $, BaseLogger, resourceBundle, ServiceRequestGlobal) {
  "use strict";
  return function (params) {
    var self = this;
    self.getNewKoModel = function () {
      var SRDefinitionModel = ServiceRequestGlobal.getNewModel();
      return SRDefinitionModel;
    };
    self.SRDefinitionDTO = self.getNewKoModel().SRDefinitionDTO;
    ko.utils.extend(self, params.rootModel.params);
    self.resource = resourceBundle;
    self.globalLoaded = ko.observable(true);
    self.addRequestName = ko.observable();
    self.addDescription = ko.observable();
    self.addModuleType = ko.observable();
    self.addRequestType = ko.observable();
    self.addTransactionType = ko.observable();
    self.addCategoryType = ko.observable();
    self.newCategoryName = ko.observable();
    self.newProductName = ko.observable();
    self.addApplicableStatus = ko.observableArray();
    self.addSeverity = ko.observable();
    self.isActive = ko.observable(true);
    self.formFieldsArray = ko.observableArray();
    self.sectionHeaderArray = ko.observableArray();
    self.sortableArray = ko.observableArray();
    self.subHeaderArray = ko.observableArray();
    self.formHeaderName = ko.observable();
    self.infoHeaderName = ko.observable();
    self.InfoData = ko.observable();
    self.contentId = ko.observable();
    self.uploadIcon = ko.observable("");
    self.uploadFile = ko.observable(false);
    self.confirmMessageData = ko.observable();
    self.componentsArray = ko.observableArray();
    self.confirmData = ko.observable(false);
    self.selectedStepValue = ko.observable("service-request-create");
    params.baseModel.registerComponent("service-request-create", "service-requests");
    params.baseModel.registerComponent("service-requests-form-builder", "service-requests");
    params.baseModel.registerComponent("service-requests-form-preview", "service-requests");
    self.sequenceArray = ko.observableArray();
    self.sequenceNumber = 0;
    self.arrayCount = ko.observable(0);
    self.stepTwoEnable = ko.observable(false);
    self.stepThreeEnable = ko.observable(false);
    var tracker;
    var i, j;
    if (self.verifyAndEdit) {
      self.stepArray =
        ko.observableArray(
          [{
              label: self.resource.firstStep,
              id: "service-request-create",
              visited: true,
              disabled: false
            },
            {
              label: self.resource.secondStep,
              id: "service-requests-form-builder",
              visited: true,
              disabled: false
            },
            {
              label: self.resource.thirdStep,
              id: "service-requests-form-preview",
              visited: true,
              disabled: false
            }
          ]);
    } else {
      self.stepArray =
        ko.observableArray(
          [{
              label: self.resource.firstStep,
              id: "service-request-create",
              visited: false,
              disabled: false
            },
            {
              label: self.resource.secondStep,
              id: "service-requests-form-builder",
              visited: false,
              disabled: true
            },
            {
              label: self.resource.thirdStep,
              id: "service-requests-form-preview",
              visited: false,
              disabled: true
            }
          ]);
    }
    self.listener = function (event) {
      tracker = document.getElementById("fbtracker");
      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        event.preventDefault();
      }
      if (event.detail.fromStep.id === "service-requests-form-builder") {
        self.finalPayload();
      }
    };
    self.nextStep = function () {
      tracker = document.getElementById("fbtracker");
      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        return;
      }
      var itrain = document.getElementById("train");
      if (itrain.selectedStep === "service-request-create") {
        self.stepTwoEnable(true);
      }
      if (itrain.selectedStep === "service-requests-form-builder") {
        self.stepThreeEnable(true);
      }
      self.globalLoaded(false);
      for (j = 0; j < itrain.steps.length; j++) {
        if (itrain.selectedStep === itrain.steps[j].id) {
          itrain.steps[j].visited = true;
          itrain.steps[j].disabled = false;
          if (j < 2) {
            itrain.steps[j + 1].visited = true;
            itrain.steps[j + 1].disabled = false;
          }
          break;
        }
      }
      ko.tasks.runEarly();
      var loadIndex = 0;
      for (i = 0; i < self.stepArray().length; i++) {
        if (self.stepArray()[i].id === self.selectedStepValue()) {
          loadIndex = i + 1;
          break;
        }
      }
      self.selectedStepValue(self.stepArray()[loadIndex].id);
      self.globalLoaded(true);
    };
    self.previousStep = function () {
      tracker = document.getElementById("fbtracker");
      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        return;
      }
      self.globalLoaded(false);
      var itrain = document.getElementById("train");
      for (j = 0; j < itrain.steps.length; j++) {
        if (itrain.selectedStep === itrain.steps[j].id) {
          itrain.steps[j].visited = true;
          itrain.steps[j].disabled = false;
          if (j > 0) {
            itrain.steps[j - 1].visited = true;
            itrain.steps[j - 1].disabled = false;
          }
          break;
        }
      }
      ko.tasks.runEarly();
      var loadIndex = 0;
      for (i = 0; i < self.stepArray().length; i++) {
        if (self.stepArray()[i].id === self.selectedStepValue()) {
          loadIndex = i - 1;
          break;
        }
      }
      self.selectedStepValue(self.stepArray()[loadIndex].id);
      self.globalLoaded(true);
    };
    self.finalPayload = function () {
      tracker = document.getElementById("fbtracker");
      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        return;
      }
      self.formFieldsArray().splice(0, self.formFieldsArray().length);
      self.subHeaderArray().splice(0, self.subHeaderArray().length);
      self.sectionHeaderArray().splice(0, self.sectionHeaderArray().length);
      for (i = 0; i < self.sortableArray().length; i++) {
        self.sortableArray()[i].sequenceNumber = i + 1;
      }
      for (i = 0; i < self.sortableArray().length; i++) {
        if (self.sortableArray()[i].type === "SCH") {
          self.sectionHeaderArray.push(self.sortableArray()[i]);
        } else if (self.sortableArray()[i].type === "SBH") {
          self.subHeaderArray.push(self.sortableArray()[i]);
        } else {
          self.formFieldsArray.push(self.sortableArray()[i]);
        }
      }
      self.SRDefinitionDTO.form.fields = self.formFieldsArray();
      self.SRDefinitionDTO.form.subHeaders = self.subHeaderArray();
      self.SRDefinitionDTO.form.sectionHeaders = self.sectionHeaderArray();
      self.SRDefinitionDTO.form.header = self.formHeaderName();
      self.SRDefinitionDTO.form.infoNote.header = self.infoHeaderName();
      self.SRDefinitionDTO.form.infoNote.description = self.InfoData();
      self.SRDefinitionDTO.form.confirmMessage = self.confirmMessageData();
      self.SRDefinitionDTO.form.infoNote.icon.value = self.contentId();
      if (self.SRDefinitionDTO.form.infoNote.icon.value) {
        self.uploadIcon(self.resource.fileUploadSuccessful);
        self.uploadFile(true);
      }
    };
    self.payloadToArray = function () {
      self.sequenceNumber = 0;
      self.sortableArray().splice(0, self.sortableArray().length);
      for (i = 0; i < self.SRDefinitionDTO.form.fields.length; i++) {
        self.sortableArray.push(self.SRDefinitionDTO.form.fields[i]);
        self.sequenceNumber = self.sequenceNumber + 1;
      }
      if (self.SRDefinitionDTO.form.sectionHeaders) {
        for (i = 0; i < self.SRDefinitionDTO.form.sectionHeaders.length; i++) {
          self.sortableArray.push(self.SRDefinitionDTO.form.sectionHeaders[i]);
          self.sequenceNumber = self.sequenceNumber + 1;
        }
      }
      if (self.SRDefinitionDTO.form.subHeaders) {
        for (i = 0; i < self.SRDefinitionDTO.form.subHeaders.length; i++) {
          self.sortableArray.push(self.SRDefinitionDTO.form.subHeaders[i]);
          self.sequenceNumber = self.sequenceNumber + 1;
        }
      }
      for (j = 0; j < self.sortableArray().length - 1; j++) {
        for (var k = (j + 1); k < self.sortableArray().length; k++) {
          if (self.sortableArray()[j].sequenceNumber > self.sortableArray()[k].sequenceNumber) {
            var temp = self.sortableArray()[j];
            self.sortableArray()[j] = self.sortableArray()[k];
            self.sortableArray()[k] = temp;
          }
        }
      }
    };
    self.formBuilderScreen = function () {
      self.payloadToArray();
      self.arrayCount(0);
      self.componentsArray().splice(0, self.componentsArray().length);
      for (i = 0; i < self.sortableArray().length; i++) {
        var data = {
          id: self.sortableArray()[i].type,
          text: null
        };
        self.componentsArray.push({
          data: data,
          id: data.id + "_" + (self.arrayCount() + 1),
          payload: self.sortableArray()[i]
        });
        self.arrayCount(self.arrayCount() + 1);
      }
    };
    self.reviewScreen = function () {
      params.baseModel.registerComponent("service-request-view", "service-requests");
      params.dashboard.loadComponent("service-request-view", {
        SRDefinitionDTO: self.SRDefinitionDTO
      }, self);
    };
    if (params.rootModel.editForm) {
      self.formHeaderName(self.SRDefinitionDTO.form.header);
      self.infoHeaderName(self.SRDefinitionDTO.form.infoNote.header);
      self.InfoData(self.SRDefinitionDTO.form.infoNote.description);
      self.confirmMessageData(self.SRDefinitionDTO.form.confirmMessage);
      if (self.confirmMessageData()) {
        self.confirmData(true);
      }
      self.contentId(self.SRDefinitionDTO.form.infoNote.icon.value);
      if (self.SRDefinitionDTO.form.infoNote.icon.value) {
        self.uploadIcon(self.resource.fileUploadSuccessful);
        self.uploadFile(true);
      }
      self.formBuilderScreen();
      self.selectedStepValue("service-requests-form-builder");
    }
    if (params.rootModel.goToPreview) {
      self.formHeaderName(self.SRDefinitionDTO.form.header);
      self.infoHeaderName(self.SRDefinitionDTO.form.infoNote.header);
      self.InfoData(self.SRDefinitionDTO.form.infoNote.description);
      self.confirmMessageData(self.SRDefinitionDTO.form.confirmMessage);
      if (self.confirmMessageData()) {
        self.confirmData(true);
      }
      self.contentId(self.SRDefinitionDTO.form.infoNote.icon.value);
      if (self.SRDefinitionDTO.form.infoNote.icon.value) {
        self.uploadIcon(self.resource.fileUploadSuccessful);
        self.uploadFile(true);
      }
      self.selectedStepValue("service-requests-form-preview");
    }
  };
});