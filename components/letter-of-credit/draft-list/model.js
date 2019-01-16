define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var DraftModel = function() {
    var baseService = BaseService.getInstance();
    var Deferred, getDrafts = function(deferred) {
        var options = {
          url: "letterofcredits/drafts",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getDraft = function(id, deferred) {
        var options = {
            url: "letterofcredits/drafts/{draftId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "draftId": id
          };
        baseService.fetch(options, params);
      };
    return {
      getDrafts: function() {
        Deferred = $.Deferred();
        getDrafts(Deferred);
        return Deferred;
      },
      getDraft: function(id) {
        Deferred = $.Deferred();
        getDraft(id, Deferred);
        return Deferred;
      }
    };
  };
  return new DraftModel();
});