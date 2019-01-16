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
      validateStateDeferred, validateState = function(productClass, productSubClass, state, deferred) {
        var params = {
            productClass: productClass,
            productSubClass: productSubClass,
            state: state
          },
          options = {
            url: "productClass/{productClass}/type/{productSubClass}/states/{state}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
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
      validateState: function(productClass, productSubClass, state) {
        validateStateDeferred = $.Deferred();
        validateState(productClass, productSubClass, state, validateStateDeferred);
        return validateStateDeferred;
      },
      createSession: function() {
        createSessionDeferred = $.Deferred();
        createSession(createSessionDeferred);
        return createSessionDeferred;
      }
    };
  };
  return new productHomeModel();
});
