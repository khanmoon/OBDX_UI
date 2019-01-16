define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  var AdminActivitiesModel = function() {
    var baseService = BaseService.getInstance();
    var fetchLinesDeferred, fetchLines = function(deferred) {
      var options = {
        url: "admin-activities",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetchJSON(options);
    };
    return {
      fetchLines: function() {
        fetchLinesDeferred = $.Deferred();
        fetchLines(fetchLinesDeferred);
        return fetchLinesDeferred;
      }
    };
  };
  return new AdminActivitiesModel();
});