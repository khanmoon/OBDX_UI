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
   * @property {Object} requestedTenure - Object containing the Requested Loans Tenure details
   * @property {Integer} requestedTenure.days - Number of days in tenure
   * @property {Integer} requestedTenure.months - Number of months in tenure
   * @property {Integer} requestedTenure.years - Number of years in tenure
   * @property {string} purposeType - The purpose for requiring a loan
   * @property {string} purpose - The purpose for requiring a loan
   * @property {Object} expectedSettlementDate - Object containing the expected settlement date value
   * @property {string} expectedSettlementDate.dateString - the expected settlement date
   * @property {boolean} isCapitalizeFeesOpted - true if isCapitalizeFeesOpted is checked
   * @property {boolean} isSettlementRequired - true if isSettlementRequired is checked
   * @property {string} frequency - the value of repayment frequency
   * @property {string} noOfCoApplicants - the number of co-applicants of the loan
   * @property {string} facilityId - The generated facility ID for the submission
   * @property {string} productGroupCode - Value of Product Group Code
   * @property {string} productGroupName - Value of Product Group Name
   */
  var RequirementsModel = function() {
    /**
     * In case more than one instance of model is required
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf Requirements~RequirementsModel
     */
    var Model = function(currency) {
        this.loanRequirement = {
          requestedAmount: {
            currency: currency,
            amount: 0
          },
          requestedTenure: {
            days: 0,
            months: 0,
            years: ""
          },
          purchasePrice: {
            currency: currency,
            amount: ""
          },
          downpaymentAmount: {
            currency: currency,
            amount: ""
          },
          isIPA: false,
          isCapitalizeFeesOpted: false,
          isSettlementRequired: false,
          purpose: {
            code: ""
          },
          purposeType: "",
          frequency: "Monthly",
          noOfCoApplicants: "",
          productGroupCode: null,
          productGroupName: null,
          productGroupSerialNumber: null,
          productClass: null,
          productSubClass: null,
          offerId: null,
          productId: null
        };
      },
      params, baseService = BaseService.getInstance();

    var submitRequirementsDeferred,
      submitRequirements = function(url, submissionId, requirements, deferred) {
        params = {
          "submissionId": submissionId
        };
        var options = {
          url: url,
          data: requirements,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options, params);
      },
      fetchRequirementsDeferred,
      fetchRequirements = function(submissionId, deferred) {
        params = {
          "submissionId": submissionId
        };
        var options = {
          url: "submissions/{submissionId}/loanApplications",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      getOtherDetailsDeferred,
      getOtherDetails = function(submissionId, applicantId, deferred) {
        params = {
          submissionId: submissionId,
          applicantId: applicantId
        };
        var options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/otherDetails",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      submitMilitaryDisclosureDeferred,
      submitMilitaryDisclosure = function(submissionId, applicantId, payload, update, deferred) {
        params = {
          submissionId: submissionId,
          applicantId: applicantId
        };
        var options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/otherDetails",
          data: JSON.stringify(payload),
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        if (update) {
          baseService.update(options, params);
        } else {
          baseService.add(options, params);
        }
      };
    return {
      getNewModel: function(currency) {
        return new Model(currency);
      },
      submitRequirements: function(url, submissionId, requirements) {
        submitRequirementsDeferred = $.Deferred();
        submitRequirements(url, submissionId, requirements, submitRequirementsDeferred);
        return submitRequirementsDeferred;
      },
      fetchRequirements: function(submissionId) {
        fetchRequirementsDeferred = $.Deferred();
        fetchRequirements(submissionId, fetchRequirementsDeferred);
        return fetchRequirementsDeferred;
      },
      getOtherDetails: function(submissionId, applicantId) {
        getOtherDetailsDeferred = $.Deferred();
        getOtherDetails(submissionId, applicantId, getOtherDetailsDeferred);
        return getOtherDetailsDeferred;
      },
      submitMilitaryDisclosure: function(submissionId, applicantId, payload, update) {
        submitMilitaryDisclosureDeferred = $.Deferred();
        submitMilitaryDisclosure(submissionId, applicantId, payload, update, submitMilitaryDisclosureDeferred);
        return submitMilitaryDisclosureDeferred;
      }
    };
  };
  return new RequirementsModel();
});
