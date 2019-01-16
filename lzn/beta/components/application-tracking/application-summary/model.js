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
  var ApplicationSummaryModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),

      appDetailsDeferred, appStagesDeferred, appSummaryDeferred, fetchApplicationDetails = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchApplicationStages = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/progress",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchApplicationSummary = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/summary",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchApplicationDetails: function(submissionId, applicationId) {
        appDetailsDeferred = $.Deferred();
        fetchApplicationDetails(submissionId, applicationId, appDetailsDeferred);
        return appDetailsDeferred;
      },
      fetchApplicationStages: function(submissionId, applicationId) {
        appStagesDeferred = $.Deferred();
        fetchApplicationStages(submissionId, applicationId, appStagesDeferred);
        return appStagesDeferred;
      },
      fetchApplicationSummary: function(submissionId, applicationId) {
        appSummaryDeferred = $.Deferred();
        fetchApplicationSummary(submissionId, applicationId, appSummaryDeferred);
        return appSummaryDeferred;
      }
    };
  };
  return new ApplicationSummaryModel();
});