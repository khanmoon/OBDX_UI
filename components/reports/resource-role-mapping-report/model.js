define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var reportGenerationModel = function() {
    var Model = function() {
        this.reportParams = {

          childRole: null

        };
      },
      baseService = BaseService.getInstance(),
      fetchChildRoleDeferred, fetchChildRole = function(enterpriseRoleId, deferred) {
        var params = {
            "enterpriseRoleId": enterpriseRoleId
          },
          options = {
            url: "applicationRoles?enterpriseRole=" + enterpriseRoleId,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      fetchParentRoleDeferred, fetchParentRole = function(deferred) {

        var options = {
          url: "enterpriseRoles?isLocal=true",
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
      getNewModel: function(dataModel) {
        return new Model(dataModel);
      },
      fetchChildRole: function(enterpriseRoleId) {
        fetchChildRoleDeferred = $.Deferred();
        fetchChildRole(enterpriseRoleId, fetchChildRoleDeferred);
        return fetchChildRoleDeferred;
      },
      fetchParentRole: function() {
        fetchParentRoleDeferred = $.Deferred();
        fetchParentRole(fetchParentRoleDeferred);
        return fetchParentRoleDeferred;
      }

    };
  };
  return new reportGenerationModel();
});