/*global define, console*/
define([
  "jquery",
  "baseService"

], function($, BaseService) {
  "use strict";

  var ViewBlackoutModel = function() {
    var baseService = BaseService.getInstance();

    var createBlackoutDeferred, createBlackout = function(model, deferred) {
        var options = {
            url: "blackouts",
            data: model,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          },
          params = {
            "model": model
          };
        baseService.add(options, params);
      },
      fetchTaskNameDeferred, fetchTaskName = function(taskId, deferred) {
        var options = {
          url: "resourceTasks/" + taskId,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.fetch(options);
      },
      fetchUserTypeDeferred, fetchUserType = function(deferred) {
        var options = {
          url : "enterpriseRoles?isLocal=true",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };

    return {
      createBlackout: function(model) {
        createBlackoutDeferred = $.Deferred();
        createBlackout(model, createBlackoutDeferred);
        return createBlackoutDeferred;
      },
      fetchUserType: function() {
        fetchUserTypeDeferred = $.Deferred();
        fetchUserType(fetchUserTypeDeferred);
        return fetchUserTypeDeferred;
      },
      fetchTaskName: function(taskId) {
        fetchTaskNameDeferred = $.Deferred();
        fetchTaskName(taskId, fetchTaskNameDeferred);
        return fetchTaskNameDeferred;
      }
    };

  };
  return new ViewBlackoutModel();
});