define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "ojL10n!resources/nls/service-request-create",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojselectcombobox",
  "ojs/ojswitch",
  "ojs/ojlistview",
  "ojs/ojarraydataprovider"
], function (oj, ko, $, ServiceRequestsApprovalView, BaseLogger, resourceBundle) {
  "use strict";
  return function (params) {
    var self = this;
    var i;
    var j;
    var k;
    self.resource = resourceBundle;
    ko.utils.extend(self, params.rootModel.params);
    self.formArray = ko.observableArray();
    self.transactionName = ko.observable(self.resource.message);
    self.statusesData = ko.observableArray();
    self.severityData = ko.observableArray();
    self.requestTypeData = ko.observableArray();
    self.applicableStatuses = ko.observableArray();
    self.priorityType = ko.observable();
    self.requestType = ko.observable();
    self.fileUploaded = ko.observable(false);
    params.baseModel.registerComponent("text-box-control", "service-requests");
    params.baseModel.registerComponent("sub-header-control", "service-requests");
    params.baseModel.registerComponent("section-header-control", "service-requests");
    params.baseModel.registerComponent("radio-button-control", "service-requests");
    params.baseModel.registerComponent("check-box-control", "service-requests");
    params.baseModel.registerComponent("account-number-control", "service-requests");
    params.baseModel.registerComponent("drop-list-control", "service-requests");
    params.baseModel.registerComponent("multi-select-control", "service-requests");
    params.baseModel.registerComponent("account-number-debit-card-control", "service-requests");
    params.baseModel.registerComponent("gender-control", "service-requests");
    params.baseModel.registerComponent("date-picker-control", "service-requests");
    params.baseModel.registerComponent("salutation-control", "service-requests");
    params.baseModel.registerComponent("toggle-button-control", "service-requests");
    params.baseModel.registerComponent("file-upload-control", "service-requests");
    params.baseModel.registerComponent("country-states-control", "service-requests");
    self.selectedComponent = ko.observable("text-box-control");
    self.sectionHeader = ko.observable("section-header-control");
    self.subHeader = ko.observable("sub-header-control");
    self.countryStates = ko.observable("country-states-control");
    self.upload = ko.observable("file-upload-control");
    self.gender = ko.observable("gender-control");
    self.salutation = ko.observable("salutation-control");
    self.radioButton = ko.observable("radio-button-control");
    self.datePicker = ko.observable("date-picker-control");
    self.checkBox = ko.observable("check-box-control");
    self.accountNumber = ko.observable("account-number-control");
    self.dropList = ko.observable("drop-list-control");
    self.toggle = ko.observable("toggle-button-control");
    self.multiSelect = ko.observable("multi-select-control");
    self.accountNumberDebitCard = ko.observable("account-number-debit-card-control");
    params.dashboard.headerName(self.resource.serviceRequestCreateHeader);
    self.dataProvider = new oj.ArrayDataProvider(self.formArray);
    self.showButtons = ko.observable(true);
    self.confirmExists = ko.observable(false);
    self.approvalConfirmMsg = ko.observable(false);
    var temp;
    if (self.data) {
      self.showButtons(false);
      self.SRDefinitionDTO = self.data;
      if (self.SRDefinitionDTO.form.infoNote.icon.value) {
        self.fileUploaded(true);
      }
      if (self.data.form.confirmMessage) {
        self.approvalConfirmMsg(true);
      }
      for (i = 0; i < self.data.form.fields().length; i++) {
        self.valuesArray = ko.observableArray();
        self.SRDefinitionDTO.form.fields[i] = self.data.form.fields()[i];
        self.SRDefinitionDTO.form.fields[i].name = self.data.form.fields()[i].name();
        self.SRDefinitionDTO.form.fields[i].sequenceNumber = self.data.form.fields()[i].sequenceNumber();
        self.SRDefinitionDTO.form.fields[i].type = self.data.form.fields()[i].type();
        self.SRDefinitionDTO.form.fields[i].label = self.data.form.fields()[i].label();
        self.SRDefinitionDTO.form.fields[i].validation = self.data.form.fields()[i].validation;
        if (self.data.form.fields()[i].values()) {
          for (k = 0; k < self.data.form.fields()[i].values().length; k++) {
            self.data.form.fields()[i].values()[k].code = self.data.form.fields()[i].values()[k].code();
            self.data.form.fields()[i].values()[k].description = self.data.form.fields()[i].values()[k].description();
            self.data.form.fields()[i].values()[k].sequenceNumber = self.data.form.fields()[i].values()[k].sequenceNumber();
          }
        }
        self.SRDefinitionDTO.form.fields[i].values = self.data.form.fields()[i].values();
        self.formArray.push(self.SRDefinitionDTO.form.fields[i]);
      }
      if (self.data.form.sectionHeaders()[0]) {
        for (i = 0; i < self.data.form.sectionHeaders().length; i++) {
          self.SRDefinitionDTO.form.fields[i] = self.data.form.sectionHeaders()[i];
          if (self.data.form.sectionHeaders()[i].name) {
            self.SRDefinitionDTO.form.fields[i].name = self.data.form.sectionHeaders()[i].name();
          }
          self.SRDefinitionDTO.form.fields[i].sequenceNumber = self.data.form.sectionHeaders()[i].sequenceNumber();
          self.SRDefinitionDTO.form.fields[i].type = self.data.form.sectionHeaders()[i].type();
          self.SRDefinitionDTO.form.fields[i].values = self.data.form.sectionHeaders()[i].values();
          self.formArray.push(self.SRDefinitionDTO.form.fields[i]);
        }
      }
      if (self.data.form.subHeaders()[0]) {
        for (i = 0; i < self.data.form.subHeaders().length; i++) {
          self.SRDefinitionDTO.form.fields[i] = self.data.form.subHeaders()[i];
          if (self.data.form.subHeaders()[i].name) {
            self.SRDefinitionDTO.form.fields[i].name = self.data.form.subHeaders()[i].name();
          }
          self.SRDefinitionDTO.form.fields[i].sequenceNumber = self.data.form.subHeaders()[i].sequenceNumber();
          self.SRDefinitionDTO.form.fields[i].type = self.data.form.subHeaders()[i].type();
          self.SRDefinitionDTO.form.fields[i].values = self.data.form.subHeaders()[i].values();
          self.formArray.push(self.SRDefinitionDTO.form.fields[i]);
        }
      }
      for (j = 0; j < self.formArray().length - 1; j++) {
        for (k = (j + 1); k < self.formArray().length; k++) {
          if (self.formArray()[j].sequenceNumber > self.formArray()[k].sequenceNumber) {
            temp = self.formArray()[j];
            self.formArray()[j] = self.formArray()[k];
            self.formArray()[k] = temp;
          }
        }
      }
      ServiceRequestsApprovalView.fetchStatuses().done(function (data) {
        for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.statusesData.push({
            label: data.enumRepresentations[0].data[i].description,
            code: data.enumRepresentations[0].data[i].code
          });
        }
        for (j = 0; j < self.statusesData().length; j++) {
          for (k = 0; k < self.SRDefinitionDTO.allowedStatuses().length; k++) {
            if (self.SRDefinitionDTO.allowedStatuses()[k] === self.statusesData()[j].code) {
              self.applicableStatuses.push(self.statusesData()[j].label);
              break;
            }
          }
        }
      });
      ServiceRequestsApprovalView.fetchSeverity().done(function (data) {
        for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.severityData.push({
            label: data.enumRepresentations[0].data[i].description,
            code: data.enumRepresentations[0].data[i].code
          });
        }
        for (j = 0; j < self.severityData().length; j++) {
          if (self.SRDefinitionDTO.priorityType() === self.severityData()[j].code) {
            self.priorityType(self.severityData()[j].label);
            break;
          }
        }
      });
      ServiceRequestsApprovalView.fetchRequestTypes().done(function (data) {
        for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.requestTypeData.push({
            label: data.enumRepresentations[0].data[i].description,
            code: data.enumRepresentations[0].data[i].code
          });
        }
        for (j = 0; j < self.requestTypeData().length; j++) {
          if (self.SRDefinitionDTO.requestType() === self.requestTypeData()[j].code) {
            self.requestType(self.requestTypeData()[j].label);
            break;
          }
        }
      });
    } else {
      if (self.SRDefinitionDTO.form.infoNote.icon.value) {
        self.fileUploaded(true);
      }
      if (self.SRDefinitionDTO.form.confirmMessage) {
        self.confirmExists(true);
      }
      for (i = 0; i < self.SRDefinitionDTO.form.fields.length; i++) {
        if (!(self.SRDefinitionDTO.form.fields[i].type === "SBH" || self.SRDefinitionDTO.form.fields[i].type === "SCH")) {
          self.SRDefinitionDTO.form.fields[i].validation.isMandatory = ko.observable(self.SRDefinitionDTO.form.fields[i].validation.isMandatory);
        }
        self.formArray.push(self.SRDefinitionDTO.form.fields[i]);
      }
      if (self.SRDefinitionDTO.form.sectionHeaders) {
        for (i = 0; i < self.SRDefinitionDTO.form.sectionHeaders.length; i++) {
          self.formArray.push(self.SRDefinitionDTO.form.sectionHeaders[i]);
        }
      }
      if (self.SRDefinitionDTO.form.subHeaders) {
        for (i = 0; i < self.SRDefinitionDTO.form.subHeaders.length; i++) {
          self.formArray.push(self.SRDefinitionDTO.form.subHeaders[i]);
        }
      }
      for (j = 0; j < self.formArray().length - 1; j++) {
        for (k = (j + 1); k < self.formArray().length; k++) {
          if (self.formArray()[j].sequenceNumber > self.formArray()[k].sequenceNumber) {
            temp = self.formArray()[j];
            self.formArray()[j] = self.formArray()[k];
            self.formArray()[k] = temp;
          }
        }
      }
      ServiceRequestsApprovalView.fetchStatuses().done(function (data) {
        for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.statusesData.push({
            label: data.enumRepresentations[0].data[i].description,
            code: data.enumRepresentations[0].data[i].code
          });
        }
        for (j = 0; j < self.statusesData().length; j++) {
          for (k = 0; k < self.SRDefinitionDTO.allowedStatuses.length; k++) {
            if (self.SRDefinitionDTO.allowedStatuses[k] === self.statusesData()[j].code) {
              self.applicableStatuses.push(self.statusesData()[j].label);
              break;
            }
          }
        }
      });
      ServiceRequestsApprovalView.fetchSeverity().done(function (data) {
        for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.severityData.push({
            label: data.enumRepresentations[0].data[i].description,
            code: data.enumRepresentations[0].data[i].code
          });
        }
        for (j = 0; j < self.severityData().length; j++) {
          if (self.SRDefinitionDTO.priorityType === self.severityData()[j].code) {
            self.priorityType(self.severityData()[j].label);
            break;
          }
        }
      });
      ServiceRequestsApprovalView.fetchRequestTypes().done(function (data) {
        for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.requestTypeData.push({
            label: data.enumRepresentations[0].data[i].description,
            code: data.enumRepresentations[0].data[i].code
          });
        }
        for (j = 0; j < self.requestTypeData().length; j++) {
          if (self.SRDefinitionDTO.requestType === self.requestTypeData()[j].code) {
            self.requestType(self.requestTypeData()[j].label);
            break;
          }
        }
      });
    }
    self.editBasicDetails = function () {
      params.baseModel.registerComponent("service-requests-train", "service-requests");
      params.dashboard.loadComponent("service-requests-train", {
        SRDefinitionDTO: self.SRDefinitionDTO
      }, self);
    };
    self.onBack = function () {
      params.baseModel.registerComponent("service-requests-search", "service-requests");
      params.dashboard.loadComponent("service-requests-search", {}, self);
    };
  };
});