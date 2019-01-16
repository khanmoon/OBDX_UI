define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var FileCreateModel = function() {
    var baseService = BaseService.getInstance();

    var fetchMeDeferred, fetchMe = function(deferred) {

      var options = {
        url: "me",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    return {
      fetchMe: function() {
        fetchMeDeferred = $.Deferred();
        fetchMe(fetchMeDeferred);
        return fetchMeDeferred;
      }
    };
  };
  return new FileCreateModel();
});
