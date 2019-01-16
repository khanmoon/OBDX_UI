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
    ko.utils.extend(self, params.rootModel);
    self.id = params.id;
    self.index = params.index;
    var j;
    self.refresh = ko.observable(true);
    self.location = parseInt(self.id.split("_")[1]);
    self.checkboxListCopy = ko.observableArray();
    self.resource = ResourceBundle;
    self.isDetails = ko.observable(true);
    self.buttonShow = ko.observable(true);
    self.isDisabled = ko.observable(false);
    self.uniqueId = ko.observable();
    if (params.id) {
      self.uniqueId(params.id);
    }
    self.currentValue = ko.observableArray([]);
    self.checkboxList = ko.observableArray([{
        code: "checkboxSelects1",
        description: ko.observable()
      },
      {
        code: "checkboxSelects2",
        description: ko.observable()
      }
    ]);
    self.formField = ko.observable({
      type: "FFMC",
      name: null,
      label: null,
      hintText: null,
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
    self.addItem = function() {
      var checkboxArray = {
        code: "checkboxSelects" + (self.checkboxList().length + 1),
        description: ko.observable("")
      };
      self.checkboxList.push(checkboxArray);
    };
    if (params.payload) {
      self.formField().type = params.payload.type;
      self.formField().name = params.payload.name;
      self.formField().label = params.payload.label;
      self.formField().errorMessage = params.payload.errorMessage;
      self.formField().sequenceNumber = params.payload.sequenceNumber;
      self.formField().validation = params.payload.validation;
      self.formField().validation.isMandatory = ko.observable(params.payload.validation.isMandatory());
      self.checkboxList().splice(0, self.checkboxList().length);
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
        self.checkboxList().push({
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
      self.checkboxList().splice(0, self.checkboxList().length);
      for (j = 0; j < params.rootModel.values.length; j++) {
        self.checkboxList().push({
          code: params.rootModel.values[j].code,
          description: params.rootModel.values[j].description
        });
      }
      self.isDisabled(true);
      self.buttonShow(false);
      self.isDetails(true);
    }
    self.deleteCheckbox = function(event, index) {
      self.refresh(false);
      var position;
      if (self.checkboxList().length > 1) {
        for (j = 0; j < self.checkboxList().length; j++) {
          if (self.checkboxList()[j].code === index.code) {
            position = j;
            break;
          }
        }
        ko.tasks.runEarly();
        self.checkboxList.splice(position, 1);
      }
      self.refresh(true);
    };
    self.saveCheckbox = function() {
      self.formField().values.splice(0, self.formField().values.length);
      for (j = 0; j < self.checkboxList().length; j++) {
        self.formField().values.push({
          code: self.checkboxList()[j].code,
          description: self.checkboxList()[j].description(),
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
    self.copyCheckboxComponent = function() {
      self.formField().values.splice(0, self.formField().values.length);
      for (j = 0; j < self.checkboxList().length; j++) {
        self.formField().values.push({
          code: self.checkboxList()[j].code,
          description: self.checkboxList()[j].description()
        });
      }
      params.rootModel.copyComponent(self);
    };
    self.deleteCheckboxComponent = function() {
      params.rootModel.deleteComponent(self);
    };
  };
});
