define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  var AccessPointSearchModel = function() {
    var baseService = BaseService.getInstance();
    var searchDeffered,
      search = function(deferred, queryParams) {
        var params = {
            "accessPoint": queryParams.accessPoint,
            "description": queryParams.description
          },
          options = {
            url: "accessPoints?accessPointId={accessPoint}&description={description}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      };
    var getAccessPointDeffered,
      getAccessPoint = function(deferred, queryParams) {
        var params = {
            "accessPoint": queryParams.accessPoint
          },
          options = {
            url: "accessPoints/{accessPoint}",

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
      search: function(queryParams) {
        searchDeffered = $.Deferred();
        search(searchDeffered, queryParams);
        return searchDeffered;
      },
      getAccessPoint: function(queryParams) {
        getAccessPointDeffered = $.Deferred();
        getAccessPoint(getAccessPointDeffered, queryParams);
        return getAccessPointDeffered;
      }
    };
  };
  return new AccessPointSearchModel();
});
