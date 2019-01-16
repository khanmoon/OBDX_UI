define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var SearchVehicle = function() {
    var Model = function(state) {
        this.vehicle = {
          state: state ? state : ""
        };
      },
      baseService = BaseService.getInstance(),
      fetchProductGroupsDeferred, fetchProductGroups = function(url, deferred) {
        var options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      createSessionDeferred,
      createSession = function(deferred) {
        var options = {
          url: "session",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.add(options);
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      fetchProductGroups: function(url) {
        fetchProductGroupsDeferred = $.Deferred();
        fetchProductGroups(url, fetchProductGroupsDeferred);
        return fetchProductGroupsDeferred;
      },
      createSession: function() {
        createSessionDeferred = $.Deferred();
        createSession(createSessionDeferred);
        return createSessionDeferred;
      }
    };
  };
  return new SearchVehicle();
});