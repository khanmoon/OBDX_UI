define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  var AccessPointViewModel = function() {
    var baseService = BaseService.getInstance();
    var createAccessPointDeferred, createAccessPoint = function(deferred, payload) {
      var options = {
        data: payload,
        url: "accessPoints",
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };
      baseService.add(options);
    };
    var updateAccessPointDeferred, updateAccessPoint = function(deferred, payload, accessPoint) {
      var params = {
          "accessPoint": accessPoint
        },
        options = {
          data: payload,
          url: "accessPoints/{accessPoint}",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
      baseService.update(options, params);
    };
    var fetchAccessPointTypeDeferred, fetchAccessPointType = function(deferred) {
      var options = {
        url: "enumerations/accessPointType",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options);
    };
    var fetchScopeDeferred, fetchScope = function(deferred) {
      var options = {
        url: "accessPointScopes",
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
      createAccessPoint: function(payload) {
        createAccessPointDeferred = $.Deferred();
        createAccessPoint(createAccessPointDeferred, payload);
        return createAccessPointDeferred;
      },
      updateAccessPoint: function(payload, accessPoint) {
        updateAccessPointDeferred = $.Deferred();
        updateAccessPoint(updateAccessPointDeferred, payload, accessPoint);
        return updateAccessPointDeferred;
      },
      fetchAccessPointType: function() {
        fetchAccessPointTypeDeferred = $.Deferred();
        fetchAccessPointType(fetchAccessPointTypeDeferred);
        return fetchAccessPointTypeDeferred;
      },
      fetchScope: function() {
        fetchScopeDeferred = $.Deferred();
        fetchScope(fetchScopeDeferred);
        return fetchScopeDeferred;
      },
      readImage: function(contentId) {
        return baseService.fetch({
          url: "contents/{contentId}"
        }, {
          contentId: contentId
        });
      }
    };
  };
  return new AccessPointViewModel();
});
