define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var SegmentAuthenticationMapingModel = function() {
    var baseService = BaseService.getInstance();
    var listUserSegmentsDeferred, listUserSegments = function(deferred) {
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
      listUserSegments: function() {
        listUserSegmentsDeferred = $.Deferred();
        listUserSegments(listUserSegmentsDeferred);
        return listUserSegmentsDeferred;
      }
    };
  };
  return new SegmentAuthenticationMapingModel();
});