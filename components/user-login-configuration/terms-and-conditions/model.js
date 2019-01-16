define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var UserLoginFlowDisplayModel = function() {
    var listUserLoginFlowDeferred, listUserLoginFlow = function(deferred) {
      var options = {
        url : "me/loginFlow",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    var createLoginConfigDeferred, createLoginConfig = function(payload, deferred) {
      var options = {
        url: "me/loginFlow",
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.add(options);
    };
    return {
      listUserLoginFlow: function() {
        listUserLoginFlowDeferred = $.Deferred();
        listUserLoginFlow(listUserLoginFlowDeferred);
        return listUserLoginFlowDeferred;
      },
      createLoginConfig: function(payload) {
        createLoginConfigDeferred = $.Deferred();
        createLoginConfig(payload, createLoginConfigDeferred);
        return createLoginConfigDeferred;
      }
    };
  };
  return new UserLoginFlowDisplayModel();
});