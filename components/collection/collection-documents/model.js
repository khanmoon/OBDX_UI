define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var DocumentsModel = function() {
    var Deferred, get = function(deferred) {
        var options = {
          url : "enter-url-here/",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchIncotermDeferred, fetchIncoterm = function(deferred) {
        var options = {
          url: "letterofcredits/incoterms",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      get: function() {
        Deferred = $.Deferred();
        get(Deferred);
        return Deferred;
      },
      fetchIncoterm: function() {
        fetchIncotermDeferred = $.Deferred();
        fetchIncoterm(fetchIncotermDeferred);
        return fetchIncotermDeferred;
      }
    };
  };
  return new DocumentsModel();
});