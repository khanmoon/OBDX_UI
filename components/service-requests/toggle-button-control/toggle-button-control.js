define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojcheckboxset",
  "ojs/ojlabel",
  "ojs/ojvalidationgroup",
  "ojs/ojselectcombobox",
  "ojs/ojradioset"
], function(oj, ko, $, ResourceBundle) {
  "use strict";
  return function(params) {
    var self = this;
    var tracker;
    ko.utils.extend(self, params.rootModel);
    self.id = params.id;
    self.index = params.index;
    self.resource = ResourceBundle;
    self.uniqueId = ko.observable();
    self.location = parseInt(self.id.split("_")[1]);
    self.buttonShow = ko.observable(true);
    self.selectedOption = ko.observable();
    self.isDetails = ko.observable(true);
    self.isDisabled = ko.observable(false);
    if (params.id) {
      self.uniqueId(params.id);
    }
    self.formField = ko.observable({
      type: "FFTC",
      name: null,
      label: null,
      hintText: null,
      errorMessage: null,
      sequenceNumber: null,
      validation: {
        isMandatory:  ko.observable(true)
      },
      values: {
        firstOption: null,
        secondOption: null
      }
    });
    self.showHideDetails = function() {
      if (!self.isDetails()) {
        self.isDetails(true);
      } else {
        tracker = document.getElementById(self.id + "track");
        if (!params.baseModel.showComponentValidationErrors(tracker)) {
          return;
        }
        self.isDetails(false);
      }
    };
    if(params.payload){
      self.formField().type =params.payload.type;
      self.formField().name =params.payload.name;
      self.formField().label =params.payload.label;
      self.formField().errorMessage =params.payload.errorMessage;
      self.formField().sequenceNumber =params.payload.sequenceNumber;
      self.formField().validation = params.payload.validation;
      self.formField().validation.isMandatory = ko.observable(params.payload.validation.isMandatory());
      self.formField().values = params.payload.values;

    }
    if(params.rootModel.type)
    {
      self.formField().type =params.rootModel.type;
      self.formField().name =params.rootModel.name;
      self.formField().label =params.rootModel.label;
      self.formField().errorMessage =params.rootModel.errorMessage;
      self.formField().sequenceNumber =params.rootModel.sequenceNumber;
      self.formField().validation = params.rootModel.validation;
      self.formField().validation.isMandatory = ko.observable(params.rootModel.validation.isMandatory());
      self.formField().values = params.rootModel.values;
      self.isDisabled(true);
      self.buttonShow(false);
    }
    self.saveToggle = function() {
      tracker = document.getElementById(self.id + "track");
      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        return;
      }
      self.isDetails(false);
      params.rootModel.storePayload(self);
    };
    self.deleteToggleComponent = function() {
      params.rootModel.deleteComponent(self);
    };
  };
});
