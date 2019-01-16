define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/service-requests-form-builder",
  "framework/js/constants/constants",
  "./model",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojinputtext"
], function(oj, ko, $, ResourceBundle, Constants, ServiceRequestsFormPreviewModel) {
  "use strict";
  return function(params) {
    var self = this;
    var i, j, k;
    ko.utils.extend(self, params.rootModel);
    self.resource = ResourceBundle;
    self.formData = ko.observable(false);
    self.formArray = ko.observableArray();
    params.baseModel.registerComponent("header-view", "service-requests");
    params.baseModel.registerComponent("text-box-view", "service-requests");
    params.baseModel.registerComponent("sub-header-view", "service-requests");
    params.baseModel.registerComponent("section-header-view", "service-requests");
    params.baseModel.registerComponent("info-view", "service-requests");
    params.baseModel.registerComponent("radio-button-view", "service-requests");
    params.baseModel.registerComponent("check-box-view", "service-requests");
    params.baseModel.registerComponent("account-number-view", "service-requests");
    params.baseModel.registerComponent("drop-list-view", "service-requests");
    params.baseModel.registerComponent("multi-select-view", "service-requests");
    params.baseModel.registerComponent("account-number-debit-card-view", "service-requests");
    params.baseModel.registerComponent("salutation-view", "service-requests");
    params.baseModel.registerComponent("gender-view", "service-requests");
    params.baseModel.registerComponent("toggle-button-view", "service-requests");
    params.baseModel.registerComponent("date-picker-view", "service-requests");
    params.baseModel.registerComponent("file-upload-view", "service-requests");
    params.baseModel.registerComponent("country-states-view", "service-requests");
	self.imageData = ko.observable();
    self.viewUploaded = ko.observable(false);
    params.dashboard.headerName(self.resource.serviceRequestCreateHeader);
    self.header = ko.observable(self.SRDefinitionDTO.form.header);
    self.infoNote = ko.observable({
      header: self.SRDefinitionDTO.form.infoNote.header,
      description: self.SRDefinitionDTO.form.infoNote.description
      });
      if (self.contentId()) {
          ServiceRequestsFormPreviewModel.getFile(self.contentId()).then(function (data) {
              self.imageData("data:" + data.contentDTOList[0].mimeType + ";base64," + data.contentDTOList[0].content);
              self.viewUploaded(true);
          });
      }
    for (i = 0; i < self.SRDefinitionDTO.form.fields.length; i++) {
      if (self.SRDefinitionDTO.form.fields[i].type === "SBH" || self.SRDefinitionDTO.form.fields[i].type === "SCH") {
        self.formArray.push({
          type: self.SRDefinitionDTO.form.fields[i].type,
          name: self.SRDefinitionDTO.form.fields[i].name,
          value: self.SRDefinitionDTO.form.fields[i].values[0].description,
          sequenceNumber: self.SRDefinitionDTO.form.fields[i].sequenceNumber
        });
      } else {
        self.formArray.push(self.SRDefinitionDTO.form.fields[i]);
      }
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
    self.formData(true);
    self.loadFormBuilder = function() {
      self.formBuilderScreen();
      self.previousStep();
    };
    var selectedStepValueSubscription = self.selectedStepValue.subscribe(function() {
      self.formBuilderScreen();
    });
    self.dispose = function() {
      selectedStepValueSubscription.dispose();
    };
  };
});
