define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var reviewReportUserMapModel = function() {
    var
      baseService = BaseService.getInstance(),
      listAllReportsDeferred, listAllReports = function(deferred, url) {
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
      fetchUserDetailsDeferred, fetchUserDetails = function(deferred, userId) {
        var options = {
            url: "users/{userId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "userId": userId
          };
        baseService.fetch(options, params);

      };
    return {
      listAllReports: function(url) {
        listAllReportsDeferred = $.Deferred();
        listAllReports(listAllReportsDeferred, url);
        return listAllReportsDeferred;
      },
      fetchUserDetails: function(userId) {
        fetchUserDetailsDeferred = $.Deferred();
        fetchUserDetails(fetchUserDetailsDeferred, userId);
        return fetchUserDetailsDeferred;
      }
    };
  };

  return new reviewReportUserMapModel();
});