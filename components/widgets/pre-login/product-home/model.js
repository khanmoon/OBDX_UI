define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var productHomeModel = function() {
    var baseService = BaseService.getInstance(),
      checkLoginStatusDeferred, checkLoginStatus = function(deferred) {
        var options = {
          showMessage: false,
          url: "me",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchDealerListDeferred, fetchDealerList = function(deferred) {
        var options = {
          url: "dealers",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
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
      checkLoginStatus: function() {
        checkLoginStatusDeferred = $.Deferred();
        checkLoginStatus(checkLoginStatusDeferred);
        return checkLoginStatusDeferred;
      },
      fetchDealerList: function() {
        fetchDealerListDeferred = $.Deferred();
        fetchDealerList(fetchDealerListDeferred);
        return fetchDealerListDeferred;
      },
      createSession: function() {
        createSessionDeferred = $.Deferred();
        createSession(createSessionDeferred);
        return createSessionDeferred;
      },
      fetchProductGroups: function(url) {
        fetchProductGroupsDeferred = $.Deferred();
        fetchProductGroups(url, fetchProductGroupsDeferred);
        return fetchProductGroupsDeferred;
      }
    };
  };
  return new productHomeModel();
});