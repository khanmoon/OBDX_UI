define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojcheckboxset",
  "ojs/ojlabel",
  "ojs/ojselectcombobox",
  "ojs/ojradioset",
  "ojs/ojvalidationgroup"
], function (oj, ko, $, ResourceBundle) {
  "use strict";
  return function (params) {
    var self = this;
    var tracker;
    ko.utils.extend(self, params.rootModel);
    self.id = params.id;
    self.index = params.index;
    var j;
    self.resource = ResourceBundle;
    self.isDetails = ko.observable(true);
    self.buttonShow = ko.observable(true);
    self.location = parseInt(self.id.split("_")[1]);
    self.isDisabled = ko.observable(false);
    self.enteredValue = ko.observableArray([]);
    self.uniqueId = ko.observable();
    self.validationTracker = ko.observable();
    self.hideComponent = ko.observable(false);
    self.dataRefreshed = ko.observable(true);
    if (params.id) {
      self.uniqueId(params.id);
    }
    self.formField = ko.observable({
      type: "FFDL",
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

    self.refreshList = function () {
      self.dataRefreshed(false);
      ko.tasks.runEarly();
      self.dataRefreshed(true);
    };

    self.showHideDetails = function () {
      if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      tracker = document.getElementById(self.id + "track");
      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        return;
      }
      if (!self.isDetails()) {
        self.isDetails(true);
      } else {
        self.isDetails(false);
      }
    };

    if (params.payload) {
      self.formField().type = params.payload.type;
      self.formField().name = params.payload.name;
      self.formField().label = params.payload.label;
      self.formField().errorMessage = params.payload.errorMessage;
      self.formField().sequenceNumber = params.payload.sequenceNumber;
      self.formField().validation = params.payload.validation;
      self.formField().validation.isMandatory = ko.observable(params.payload.validation.isMandatory());
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
      self.enteredValue().splice(0, self.enteredValue().length);
      for (j = 0; j < params.payload.values.length; j++) {
        self.enteredValue().push(params.payload.values[j].description);
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
      self.enteredValue().splice(0, self.enteredValue().length);
      for (j = 0; j < params.rootModel.values.length; j++) {
        self.enteredValue().push(params.rootModel.values[j].description);
      }
      self.isDisabled(true);
      self.buttonShow(false);
    }
    self.deleteDropList = function (event, index) {
      var position;
      for (j = 0; j < self.dropListArray().length; j++) {
        if (self.dropListArray()[j].code === index.code) {
          position = j;
        }
      }
      self.dropListArray.splice(position, 1);
    };
    self.saveDropList = function () {
      if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      tracker = document.getElementById(self.id + "track");
      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        return;
      }
      for (j = 0; j < self.enteredValue().length; j++) {
        self.formField().values.push({
          code: "code" + j,
          description: self.enteredValue()[j],
          sequenceNumber: j + 1
        });
      }
      self.isDetails(false);
      params.rootModel.storePayload(self);
    };
    self.copyDropListComponent = function () {
      params.rootModel.copyComponent(self);
    };
    self.deleteDropListComponent = function () {
      params.rootModel.deleteComponent(self);
    };
  };
});