define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for application offers section in the application tracking page. It serves as the model where the data to be used by the application details section is defined. Since this model is tech agnostic, it can be coupled with any technology.
   *
   * @namespace ApplicationStatusHistory~Model
   * @class ApplicationStatusHistoryModel
   */
  var ApplicationStatusHistoryModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),

      appHistoryDeferred, appStateStringMapDeferred, fetchApplicationHistory = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/history",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchApplicationStateStringMap = function(deferred, statusHistory) {
        var options = {
          url: "enumerations/applicationState",
          success: function(data) {
            deferred.resolve(data, statusHistory);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchApplicationHistory: function(submissionId, applicationId) {
        appHistoryDeferred = $.Deferred();
        fetchApplicationHistory(submissionId, applicationId, appHistoryDeferred);
        return appHistoryDeferred;
      },
      fetchApplicationStateStringMap: function(statusHistory) {
        appStateStringMapDeferred = $.Deferred();
        fetchApplicationStateStringMap(appStateStringMapDeferred, statusHistory);
        return appStateStringMapDeferred;
      }
    };
  };
  return new ApplicationStatusHistoryModel();
});