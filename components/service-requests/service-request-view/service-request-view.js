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
], function (oj, ko, $, ServiceRequestView, BaseLogger, resourceBundle) {
  "use strict";
  return function (params) {
    var self = this;
    self.resource = resourceBundle;
    ko.utils.extend(self, params.rootModel.params);
    var i, j, k;
    params.baseModel.registerElement("confirm-screen");
    self.updateMessage = ko.observable(self.SRDefinitionDTO.name);
    self.statusesData = ko.observableArray();
    self.severityData = ko.observableArray();
    self.requestTypeData = ko.observableArray();
    self.applicableStatuses = ko.observableArray();
    self.priorityType = ko.observable();
    self.requestType = ko.observable();
    self.fileUploaded = ko.observable(false);
    self.confirmExists = ko.observable(false);
    params.baseModel.registerElement("modal-window");
    ServiceRequestView.fetchStatuses().done(function (data) {
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
    ServiceRequestView.fetchSeverity().done(function (data) {
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
    ServiceRequestView.fetchRequestTypes().done(function (data) {
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
    self.formArray = ko.observableArray();
    params.baseModel.registerComponent("service-requests-verify", "service-requests");
    self.transactionName = ko.observable(self.resource.message);
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
    params.baseModel.registerComponent("country-states-control", "service-requests");
    params.baseModel.registerComponent("toggle-button-control", "service-requests");
    params.baseModel.registerComponent("file-upload-control", "service-requests");
    self.selectedComponent = ko.observable("text-box-control");
    self.sectionHeader = ko.observable("section-header-control");
    self.subHeader = ko.observable("sub-header-control");
    self.gender = ko.observable("gender-control");
    self.country = ko.observable("country-states-control");
    self.upload = ko.observable("file-upload-control");
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
    if (self.SRDefinitionDTO.form.confirmMessage) {
      self.confirmExists(true);
    }
    for (i = 0; i < self.SRDefinitionDTO.form.fields.length; i++) {
      self.formArray.push(self.SRDefinitionDTO.form.fields[i]);
    }
    if (self.SRDefinitionDTO.form.infoNote.icon.value) {
      self.fileUploaded(true);
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
          var temp = self.formArray()[j];
          self.formArray()[j] = self.formArray()[k];
          self.formArray()[k] = temp;
        }
      }
    }
    self.createRequest = function () {
      if (self.SRDefinitionDTO.form.id) {
        ServiceRequestView.updateServiceRequest(self.SRDefinitionDTO.form.id, ko.toJSON(self.SRDefinitionDTO)).done(function (data, status, jqXhr) {
          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.updateMessage(),
            template: "service-request/service-request-confirm"
          }, self);
        });
      } else {
        ServiceRequestView.addServiceRequest(ko.toJSON(self.SRDefinitionDTO)).done(function (data, status, jqXhr) {
          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.transactionName(),
            template: "service-request/service-request-confirm"
          }, self);
        });
      }
    };
    self.editBasicDetails = function () {
      params.baseModel.registerComponent("service-requests-train", "service-requests");
      params.dashboard.loadComponent("service-requests-train", {
        SRDefinitionDTO: self.SRDefinitionDTO,
        verifyAndEdit: true
      }, self);
    };
    self.editFormBuilder = function () {
      self.editForm = ko.observable(true);
      params.baseModel.registerComponent("service-requests-train", "service-requests");
      params.dashboard.loadComponent("service-requests-train", {
        SRDefinitionDTO: self.SRDefinitionDTO,
        verifyAndEdit: true
      }, self);
    };
    self.onBack = function () {
      self.goToPreview = ko.observable(true);
      params.baseModel.registerComponent("service-requests-train", "service-requests");
      params.dashboard.loadComponent("service-requests-train", {
        SRDefinitionDTO: self.SRDefinitionDTO,
        verifyAndEdit: true
      }, self);
    };
    self.openPopUp = function() {
      $("#cancel-form").trigger("openModal");
    };
    self.closePopUp = function() {
      $("#cancel-form").hide();
    };
  };
});