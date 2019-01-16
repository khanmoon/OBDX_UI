define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  var CreditLineUsageModel = function() {
    var baseService = BaseService.getInstance();
    var fetchLinesDeferred, fetchLines = function(deferred) {
      var options = {
        url: "parties/lineLimit",
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
      fetchLines: function() {
        fetchLinesDeferred = $.Deferred();
        fetchLines(fetchLinesDeferred);
        return fetchLinesDeferred;
      }
    };
  };
  return new CreditLineUsageModel();
});