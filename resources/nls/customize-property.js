define([], function() {
  "use strict";
  var customizePropertyLocale = function() {
    return {
      root: {
        type: "Type",
        title: "Title",
        required: "Required",
        validator: "Validator",
        createProperty: "Create Property",
        propIdLabel: "Property Id",
        propValueLabel: "Property Value",
        selectType: "Please select Type",
        url: "url",
        test: "Test",
        selectedValidator: "Please select a validator",
        length: "Length",
        minLength: "min length",
        maxLength: "max length",
        defaultValue: "Default Value",
        validateValue: "Validate",
        requiredTrue: "Yes",
        requiredFalse: "No",
        validatorError: "Value not in the format specified in Validator field"
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: true
    };
  };
  return new customizePropertyLocale();
});