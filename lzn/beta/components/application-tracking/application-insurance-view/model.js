define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for application offers section in the application tracking page. It serves as the model where the data to be used by the application details section is defined. Since this model is tech agnostic, it can be coupled with any technology.
   *
   * @namespace ApplicationInsuranceView~Model
   * @class ApplicationInsuranceViewModel
   */
  var ApplicationInsuranceViewModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),

      getInsuranceListDeferred, fetchAppInsurance = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/insurance",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchAppInsurance: function(submissionId, applicationId) {
        getInsuranceListDeferred = $.Deferred();
        fetchAppInsurance(submissionId, applicationId, getInsuranceListDeferred);
        return getInsuranceListDeferred;
      }
    };
    /**
     * Method to fetch fees details of the application selected. It fires a rest api call, and once the call is completed, the function 'successHandler is fired, which is passed as an argument. It takes submissionId and applicationId also as arguments. Before placing the call, an 'option' object is created, which has the url, formed using submission and application ids and the successs handler bundled in it.
     *
     * @function fetchAppInsurance
     * @memberOf ApplicationInsuranceViewService
     * @param {String} submissionId- submission id for which details are to be fetched
     * @param {String} applicationId- application id for which details are to be fetched
     * @param {Function} successHandler- function to be called on success
     * @example
     *  ApplicationInsuranceViewService.fetchAppInsurance(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), self.successHandlerInsuranceSummary);
     */

  };
  return new ApplicationInsuranceViewModel();
});