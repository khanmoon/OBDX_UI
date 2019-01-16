define([
  "ojs/ojcore",
  "knockout",
  "paperAccordion"
], function(oj, ko) {
  "use strict";
  /**
         * View Model for product tracking Base. All the components for application tracking will be populated here. This file serves as the knockout binding for the product-tracking base component. It is used to change the data, being displayed on the screen, dynamically. It gets the data is uses from the application-additional model.
         * @namespace {function} ProductTrackingBase~viewModel
		 * @member
         * @constructor ProductTrackingBaseViewModel
         * @property {Boolean} dataLoaded - used in subsequent components to decide if the data is loaded
		 * @property {Boolean} isOfferAccepted - used in subsequent components to check if the offer is accepted or not
		 * @property {Object} additionalDetailInfoAccordion - used to store the list of accordions in the screen for the additional details

		 * @property {Object} uplDocument - Object to store upload document list, in the application documents screen
		 * @property {Object} uplTrackingDetails - Object to store all the additional information. It is defined here in the base class, so as to make it available everywhere.
        */

  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.dataLoaded = ko.observable(false);
    self.isOfferAccepted = ko.observable(false);
    self.additionalInfoAccordion = ko.observable({});
    var compNameSubscribe = self.productTrackingComponentName.subscribe(function(newValue) {
      var lastIndex = self.appComponents().length - 1;
      if (self.appComponents()[lastIndex] !== newValue) {
        self.appComponents().push(newValue);
      }
    });

    rootParams.baseModel.registerComponent("application-summary", "application-tracking");
    rootParams.baseModel.registerComponent("application-dashboard", "application-tracking");
    self.productTrackingComponentName("application-dashboard");


    /*
     * addressProof and identity proofs are arrays because there can be more than one possible document for each
     * Will be pusing an object containing the label (passport, SSN, etc) and the byte array, which will be blank for the timebeing
     */
    self.uplDocument = ko.observable({
      addressProof: ko.observable([]),
      identityProof: ko.observable([])
    });
    self.dispose = function() {
      compNameSubscribe.dispose();
    };
  };
});
