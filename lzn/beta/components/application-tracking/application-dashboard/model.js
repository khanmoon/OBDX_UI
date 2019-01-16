define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for application dashboard section in the application tracking page. It serves as the model where the data to be used by the application details section is defined. Since this model is tech agnostic, it can be coupled with any technology.
   *
   * @namespace ApplicationDashboardModel~Model
   * @class ApplicationDashboard
   */
  var ApplicationDashboardModel = function() {
    var baseService = BaseService.getInstance(),

      getComponentListDeferred, cancelApplicationdeffered, withdrawApplicationdeffered, fetchComponents = function(deferred) {
        var options = {
          url: "components/upldashboard",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetchJSON(options);
      },
      cancelApplication = function(submissionId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/cancel",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.remove(options);
      },
      withdrawApplication = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.remove(options);
      };
    return {
      fetchComponents: function() {
        getComponentListDeferred = $.Deferred();
        fetchComponents(getComponentListDeferred);
        return getComponentListDeferred;
      },
      cancelApplication: function(submissionId) {
        cancelApplicationdeffered = $.Deferred();
        cancelApplication(submissionId, cancelApplicationdeffered);
        return cancelApplicationdeffered;
      },
      withdrawApplication: function(submissionId, applicationId) {
        withdrawApplicationdeffered = $.Deferred();
        withdrawApplication(submissionId, applicationId, withdrawApplicationdeffered);
        return withdrawApplicationdeffered;
      }
    };
  };
  return new ApplicationDashboardModel();
});