define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model file for Product Requirements section. This file contains the model definition
   * for product requirements section and exports the Requirements model which can be used
   * as a component in any form in which user's product requirements are required.
   *
   * @namespace Requirements~RequirementsModel
   * @class
   * @property {Object} requestedAmount - Object containing the Requested Amount details
   * @property {string} requestedAmount.currency - ISO currency code of the requested loan amount
   * @property {Float} requestedAmount.amount - The requested loan amount in decimal format
   * @property {string} facilityId - The generated facility ID for the submission
   * @property {string} productGroupCode - Value of Product Group Code
   * @property {string} productGroupName - Value of Product Group Name
   */
  var RequirementsModel = function() {

    var baseService = BaseService.getInstance();
    /**
     * In case more than one instance of model is required
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf Requirements~RequirementsModel
     */
    var TDModel = function() {
      this.requestedAmount = {
        currency: "",
        amount: 0
      };
      this.requestedTenure = {
        months: 0,
        days: 0,
        years: 0
      };
      this.currency = "";
      this.frequency = "";
      this.noOfCoApplicants = 0;
      this.productGroupSerialNumber = "";
    };
    /**
     * Method to get new instance of Product Requirements model. This method is a static member
     * of ProductRequirements class, and on calling it will instantiate the defined [Model]{@link RequirementsModel.Model} (private to
     * this class) and return a new instance of same.
     *
     * @function
     * @memberOf Requirements~RequirementsModel
     * @returns {Object} Model
     */
    this.getNewModel = function() {
      return new TDModel();
    };
    this.createTDAccount = function(submissionId, successHandler, payload) {
      var params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/depositApplications/account",
          data: JSON.stringify(payload),
          success: function(data) {
            successHandler(data);
          }
        };
      baseService.add(options, params);
    };
  };
  return new RequirementsModel();
});
