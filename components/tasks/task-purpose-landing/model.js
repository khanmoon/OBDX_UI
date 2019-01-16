define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  return function TaskPurposeLandingModel() {
    var baseService = BaseService.getInstance();
    var fetchTaskListDeferred, fetchTaskList = function(deferred) {
        var options = {
          url: "resourceTasks?aspects={aspects}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
          params = {
            "aspects": "purpose-mapping"
          };
        baseService.fetch(options, params);
      },
      fetchPurposeListDeferred, fetchPurposeList = function(deferred) {
        var options = {
          url: "purposes/PC",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       This method fetches the task purpose mapping
       **/
      fetchTaskPurposeMappingDeferred, fetchTaskPurposeMapping = function(deferred) {
        var options = {
          url: "purposes/linkages",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchPurposeList: function() {
        fetchPurposeListDeferred = $.Deferred();
        fetchPurposeList(fetchPurposeListDeferred);
        return fetchPurposeListDeferred;
      },
      fetchTaskPurposeMapping: function() {
        fetchTaskPurposeMappingDeferred = $.Deferred();
        fetchTaskPurposeMapping(fetchTaskPurposeMappingDeferred);
        return fetchTaskPurposeMappingDeferred;
      },
      fetchTaskList: function() {
        fetchTaskListDeferred = $.Deferred();
        fetchTaskList(fetchTaskListDeferred);
        return fetchTaskListDeferred;
      }
    };
  };
});