define(["jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for account summary section in the application tracking page. It serves as the model where the data to be used by the account summary section is defined.
   *
   * @namespace AccountSummaryModel~Model
   * @class AccountSummaryModel
   */
  var accountSummary = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),
      fetchAccountSummaryDeferred,
      /**
       * Private method to get account summary details to be displayed in application dashboard of application tracker.
       * This method will only be called if submissionId, applicationId is present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchAccountSummary
       * @memberOf AccountSummaryModel
       * @param {String} submissionId - Submission id of the application
       * @param {String} applicationId Application id of the application
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      fetchAccountSummary = function(submissionId, applicationId, deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicationId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration/loans",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      };
    return {
      /**
       * Public method to get account summary details to be displayed in application dashboard of application tracker.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function fetchAccountSummary
       * @memberOf AccountSummaryModel
       * @param {String} submissionId Submission id of the application
       * @param {String} applicationId Application id of the application
       * @returns {Object} An object of type deferred
       * @example
       * AccountSummaryModel.fetchAccountSummary().then(function (data) {
       *
       * });
       */
      fetchAccountSummary: function(submissionId, applicationId) {
        fetchAccountSummaryDeferred = $.Deferred();
        fetchAccountSummary(submissionId, applicationId, fetchAccountSummaryDeferred);
        return fetchAccountSummaryDeferred;
      }
    };
  };
  return new accountSummary();
});