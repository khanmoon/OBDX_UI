define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "ojL10n!resources/nls/compliance",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, TaxResidencyInfoModel, BaseLogger, ResourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.index = Params.index;
    self.taxResidenceCountries = ko.observableArray();
    self.taxResidencyInfoLoaded = ko.observable(false);

    var taxResidencyInfoObj = {
      taxResidenceCountry: "",
      taxIdentifierType: "",
      taxIdentifier: "",
      tinAvailable: "",
      tin: "",
      tinNonAvailabilityReason: ""
    };
    self.addCountry = function(index) {
      var taxResidencyOtherCountryInfoTracker = document.getElementById("taxResidencyOtherCountryInfoTracker" + index);
      if (taxResidencyOtherCountryInfoTracker && taxResidencyOtherCountryInfoTracker.valid !== "valid") {
        taxResidencyOtherCountryInfoTracker.showMessages();
        taxResidencyOtherCountryInfoTracker.focusOn("@firstInvalidShown");
        return false;
      }
      self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo.push(JSON.parse(JSON.stringify(taxResidencyInfoObj)));
      self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo().length - 1].tinAvailable = ko.observable("true");
      self.taxIdentificationType.push(ko.observable(""));
    };

    self.removeCountry = function(index) {
      self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo.splice(index, 1);
      self.taxIdentificationType.splice(index, 1);
    };

    var taxIdentificationTypeOther = {
      code: "OTHER",
      description: self.resource.taxResidencyInfo.other
    };
    self.taxCountryChanged = function(event, data, index) {
      self.taxResidenceCountriesLoaded(false);
      TaxResidencyInfoModel.fetchTaxIdentificationTypes(event.detail.value).done(function(data) {
        self.taxIdentificationTypes()[index.$index()]=ko.observableArray([]);
        if (data.enumRepresentations && data.enumRepresentations.length > 0) {
          self.taxIdentificationTypes()[index.$index()](data.enumRepresentations[0].data);
        }
        self.taxIdentificationTypes()[index.$index()].push(JSON.parse(JSON.stringify(taxIdentificationTypeOther)));
        self.taxResidenceCountriesLoaded(true);
      });
    };

    self.continueTaxResidencyInfo = function() {
      var taxResidencyInfoTracker = document.getElementById("taxResidencyInfoTracker");
      if (taxResidencyInfoTracker && taxResidencyInfoTracker.valid !== "valid") {
        taxResidencyInfoTracker.showMessages();
        taxResidencyInfoTracker.focusOn("@firstInvalidShown");
        return false;
      }
      self.stages()[self.index].expanded(false);
      self.stages()[self.index + 1].expanded(true);
    };

    TaxResidencyInfoModel.fetchTaxResidenceCountries().done(function(data) {
      self.taxResidenceCountries(data.enumRepresentations[0].data);
      self.taxResidencyInfoLoaded(true);
    });
  };
});
