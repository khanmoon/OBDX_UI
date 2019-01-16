define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/service-requests-form-builder",
  "framework/js/constants/constants",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojcheckboxset",
  "ojs/ojlabel",
  "ojs/ojradioset",
  "ojs/ojselectcombobox",
  "ojs/ojfilepicker"
], function(oj, ko, $, ServiceRequestFileUploadModel, ResourceBundle, Constants) {
  "use strict";
  return function(params) {
    var self = this;
    self.resource = ResourceBundle;
    self.isDisabled = ko.observable(params.isDisabled);
    self.formData = ko.observable(false);
    self.needtoupload = ko.observable(true);
    self.testInput = ko.observableArray();
    self.displayValue = ko.observableArray();
    self.fileName = ko.observable();
    self.isRequired = params.rootModel.validation.isMandatory;
    ko.utils.extend(self, params.rootModel);
    self.errorMessage = ko.observable();
    self.errorMessage(params.rootModel.errorMessage);
    if (Constants.userSegment === "ADMIN") {
      self.needtoupload(false);
    }
    if (params.formData) {
      self.testInput = params.formData.values;
      self.displayValue = params.formData.displayValues;
    }
    if (self.testInput().length) {
      self.fileName(self.displayValue()[0]);
      self.formData(true);
    }
    self.fileSelectListener = function(event) {
      self.formData(false);
      var files = event.detail.files[0];
      var formData = new FormData();
      formData.append("file", files, files.name);
      formData.append("moduleIdentifier", "SERVICE_REQUEST");
      ServiceRequestFileUploadModel.uploadDocument(formData).done(function(data) {
        self.testInput().splice(0, self.testInput().length);
        self.testInput().push(
          data.contentDTOList[0].contentId.value
        );
        self.displayValue()[0] = event.detail.files[0].name;
        self.fileName(event.detail.files[0].name);
        ko.tasks.runEarly();
        self.formData(true);
      }).fail();
    };
  };
});
