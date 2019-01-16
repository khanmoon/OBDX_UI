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
], function(oj, ko, $, GenderModel, ResourceBundle) {
  "use strict";
  return function(params) {
    var self = this;
    self.resource = ResourceBundle;
    self.labelName = ko.observable();
    self.isDisabled = ko.observable(params.isDisabled);
    self.formData = ko.observable(false);
    self.testInput = ko.observableArray();
    self.genderList = ko.observableArray();
    self.isRequired = params.rootModel.validation.isMandatory;
    ko.utils.extend(self, params.rootModel);
    self.errorMessage = ko.observable();
    self.errorMessage(params.rootModel.errorMessage);
    if (self.isDisabled() === true) {
      self.formData(true);
    }
    if (params.formData) {
      self.testInput = params.formData.values;
    }
    self.valueChange = function()
    {
      self.displayValue = params.formData.displayValues;
      var j;
      for(j=0;j<self.genderList().length;j++)
      {
        if(self.genderList()[j].code===self.testInput()[0])
        {
          self.displayValue()[0] = self.genderList()[j].description;
        }
      }
    };
    if (self.isDisabled() === false) {
      GenderModel.getGenderData().done(function(data) {
        $("#gender").empty();
        var len = data.enumRepresentations[0].data.length,i;
        for (i = 0; i < len; i++) {
          self.genderList().push({
            code: data.enumRepresentations[0].data[i].code,
            description: data.enumRepresentations[0].data[i].description
          });
        }
        self.formData(true);
      });
    }
  };
});
