define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for application dashboard section in the application tracking page. It serves as the model where the data to be used by the application details section is defined. Since this model is tech agnostic, it can be coupled with any technology.
   *
   * @namespace ApplicationDashboardActionsModel~Model
   * @class ApplicationDashboardActions
   */
  var ApplicationDashboardActionsModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),

      fetchPendingListDeferred, fetchPending = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/actions",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchPending: function(submissionId, applicationId) {
        fetchPendingListDeferred = $.Deferred();
        fetchPending(submissionId, applicationId, fetchPendingListDeferred);
        return fetchPendingListDeferred;
      }
    };
  };
  return new ApplicationDashboardActionsModel();
});