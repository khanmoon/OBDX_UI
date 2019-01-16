define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojcheckboxset",
  "ojs/ojvalidationgroup",
  "ojs/ojlabel",
  "ojs/ojradioset"
], function(oj, ko, $, ResourceBundle) {
  "use strict";
  return function(params) {
    var self = this;
    var tracker;
    var i = 2;
    var j;
    self.resource = ResourceBundle;
    self.uniqueId = ko.observable();
    self.isDisabled = ko.observable(false);
    self.id = params.id;
    self.buttonShow = ko.observable(true);
    self.index = params.index;
    self.location = parseInt(self.id.split("_")[1]);
    if (params.id) {
      self.uniqueId(params.id);
    }
    self.isDetails = ko.observable(true);
    self.refresh = ko.observable(true);
    self.radioList = ko.observableArray();
    self.radioList.push({
      code: "radio1",
      description: ko.observable()
    });
    self.radioList.push({
      code: "radio2",
      description: ko.observable()
    });
    self.formField = ko.observable({
      type: "FFRB",
      name: null,
      label: null,
      errorMessage: null,
      sequenceNumber: null,
      validation: {
        isMandatory: ko.observable(true)
      },
      values: []
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
    self.addRadioButton = function() {
      i++;
      self.radioList.push({
        code: "radio" + i,
        description: ko.observable("")
      });
    };
    if (params.payload) {
      self.formField().type = params.payload.type;
      self.formField().name = params.payload.name;
      self.formField().label = params.payload.label;
      self.formField().errorMessage = params.payload.errorMessage;
      self.formField().sequenceNumber = params.payload.sequenceNumber;
      self.formField().validation = params.payload.validation;
      self.formField().validation.isMandatory = ko.observable(params.payload.validation.isMandatory());
      self.radioList().splice(0, self.radioList().length);
      var k;
      for (j = 0; j < params.payload.values.length - 1; j++) {
        for (k = j + 1; k < params.payload.values.length; k++) {
          if (params.payload.values[j].sequenceNumber > params.payload.values[k].sequenceNumber) {
            var temp = params.payload.values[j];
            params.payload.values[j] = params.payload.values[k];
            params.payload.values[k] = temp;
          }
        }
      }
      for (j = 0; j < params.payload.values.length; j++) {
        self.radioList().push({
          code: params.payload.values[j].code,
          description: ko.observable(params.payload.values[j].description)
        });
      }
    }
    if (params.rootModel.type) {
      self.formField().type = params.rootModel.type;
      self.formField().name = params.rootModel.name;
      self.formField().label = params.rootModel.label;
      self.formField().errorMessage = params.rootModel.errorMessage;
      self.formField().sequenceNumber = params.rootModel.sequenceNumber;
      self.formField().validation = params.rootModel.validation;
      self.formField().validation.isMandatory = ko.observable(params.rootModel.validation.isMandatory());
      self.radioList().splice(0, self.radioList().length);
      for (j = 0; j < params.rootModel.values.length; j++) {
        self.radioList().push({
          code: params.rootModel.values[j].code,
          description: params.rootModel.values[j].description
        });
      }
      self.buttonShow(false);
      self.isDisabled(true);
      self.isDetails(true);
    }
    self.deleteRadio = function(event, index) {
      self.refresh(false);
      var position;
      if (self.radioList().length > 2) {
        for (j = 0; j < self.radioList().length; j++) {
          if (self.radioList()[j].code === index.code) {
            position = j;
            break;
          }
        }
        self.radioList().splice(position, 1);
      }
      ko.tasks.runEarly();
      self.refresh(true);
    };
    self.saveRadio = function() {
      self.formField().values.splice(0, self.formField().values.length);
      for (j = 0; j < self.radioList().length; j++) {
        self.formField().values.push({
          code: self.radioList()[j].code,
          description: self.radioList()[j].description(),
          sequenceNumber: j + 1
        });
      }
      tracker = document.getElementById(self.id + "track");
      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        return;
      }
      self.isDetails(false);
      params.rootModel.storePayload(self);
    };
    self.copyRadioComponent = function() {
      self.formField().values.splice(0, self.formField().values.length);
      for (j = 0; j < self.radioList().length; j++) {
        self.formField().values.push({
          code: self.radioList()[j].code,
          description: self.radioList()[j].description()
        });
      }
      params.rootModel.copyComponent(self);
    };
    self.deleteRadioComponent = function() {
      params.rootModel.deleteComponent(self);
    };
  };
});
