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
  "ojs/ojradioset",
  "ojs/ojcheckboxset",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, CustomerIdentificationModel, BaseLogger, ResourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.index = Params.index;
    self.permanentCountriesLoaded = ko.observable(false);
    self.mailingCountriesLoaded = ko.observable(false);
    self.customerDataLoaded = ko.observable(false);

    self.countryChanged = function (countriesLoaded, event) {
      countriesLoaded(false);
      CustomerIdentificationModel.fetchStateList(event.detail.value).done(function(data) {
        if(data.enumRepresentations && data.enumRepresentations.length > 0) {
          self.states(data.enumRepresentations[0].data);
          countriesLoaded(true);
        }
      });
    };

    self.mailingAddressChangeHandler = function(event) {
      if (event.detail.value) {
        if ($.inArray("same", self.isMailingAddressSame()) === -1) {
          self.fillMailingAddress(true);
        } else {
          self.fillMailingAddress(false);
        }
      }
    };

    self.continueCustomerInfo = function() {
      var customerInfoTracker = document.getElementById("customerInfoTracker");
      if (customerInfoTracker && customerInfoTracker.valid !== "valid") {
        customerInfoTracker.showMessages();
        customerInfoTracker.focusOn("@firstInvalidShown");
        return false;
      }
      self.stages()[self.index].expanded(false);
      self.stages()[self.index + 1].expanded(true);
    };

      CustomerIdentificationModel.fetchCountryList().done(function(data) {
        self.countries(data.enumRepresentations[0].data);
        CustomerIdentificationModel.fetchIdentificationList().done(function(data) {
          self.identificationTypes(data.enumRepresentations[0].data);
          self.customerDataLoaded(true);
        });
      });

  };
});
