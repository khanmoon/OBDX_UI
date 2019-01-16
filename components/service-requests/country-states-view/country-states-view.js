define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojcheckboxset",
  "ojs/ojlabel",
  "ojs/ojradioset",
  "ojs/ojselectcombobox"
], function(oj, ko, $, CountryStatesModel, ResourceBundle) {
  "use strict";
  return function(params) {
    var self = this;
    self.resource = ResourceBundle;
    self.labelName = ko.observable();
    self.isDisabled = ko.observable(params.isDisabled);
    self.formData = ko.observable(false);
    self.stateData = ko.observable(true);
    self.testInput = ko.observableArray();
    self.displayValue = ko.observableArray();
    self.countryList = ko.observableArray([]);
    self.stateList = ko.observableArray([]);
    self.isRequired = params.rootModel.validation.isMandatory;
    ko.utils.extend(self, params.rootModel);
    self.errorMessage = ko.observable();
    self.errorMessage(params.rootModel.errorMessage);
    if (self.isDisabled() === true) {
      self.formData(true);
    }
    self.fetchStates = function(country) {
      self.stateData(false);
      CountryStatesModel.getStatesData(country).done(function(data) {
        self.stateList().splice(0, self.stateList().length);

        var i;
        for (i = 0; i < self.countryList().length; i++) {
          if (self.countryList()[i].code === self.testInput()[0]) {
            self.displayValue()[0] = self.countryList()[i].description;
            break;
          }
        }
        if (data.enumRepresentations) {
          var len = data.enumRepresentations[0].data.length;
          for (i = 0; i < len; i++) {
            self.stateList().push({
              code: data.enumRepresentations[0].data[i].code,
              description: data.enumRepresentations[0].data[i].description
            });
          }
        }
        ko.tasks.runEarly();
        self.stateData(true);
      });
    };
    if (params.formData) {
      self.testInput = params.formData.values;
      self.displayValue = params.formData.displayValues;
      if (self.testInput()[1]) {
        self.fetchStates(self.testInput()[0]);
      }
    }
    self.countryChangeHandler = function(event) {
      var country = event.detail.value;
      self.fetchStates(country);
    };
    self.debitChange = function() {
      var j;
      for (j = 0; j < self.stateList().length; j++) {
        if (self.stateList()[j].code === self.testInput()[1]) {
          self.displayValue()[1] = self.stateList()[j].description;
          break;
        }
      }
    };
    if (self.isDisabled() === false) {
      CountryStatesModel.getCountryData().done(function(data) {
        self.countryList().splice(0, self.countryList().length);
        var len = data.enumRepresentations[0].data.length,
          i;
        for (i = 0; i < len; i++) {
          self.countryList().push({
            code: data.enumRepresentations[0].data[i].code,
            description: data.enumRepresentations[0].data[i].description
          });
        }
        self.formData(true);
      });

    }
  };
});
