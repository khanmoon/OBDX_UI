define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  var SecurityLandingModel = function() {
    var baseService = BaseService.getInstance(),
      meDeferred, me = function(deferred) {
        var options = {
          url: "me",
          nonceRequired: true,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
        baseService.fetch(options);
      },
      getJwtTokenDeferred, getJwtToken = function(deferred, payload) {
        var options = {
          url: "jwt",
          data: payload,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        };
        baseService.add(options);
      },
      getPayeeListDeferred, getPayeeList = function(deferred) {
        var url = "payments/payeeGroup?expand=ALL&types=INTERNAL,INTERNATIONAL,INDIADOMESTIC,UKDOMESTIC,SEPADOMESTIC";
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
      };
    return {
      registerDevice: function(payload) {
        var options = {
          url: "mobileClient",
          data: payload
        };
        return baseService.add(options);
      },
      sessionCreate: function() {
        return baseService.add({
          url: "session",
          method: "POST",
          data: ""
        });
      },
      getMePreference: function() {
        var options = {
          url: "me/preferences"
        };
        return baseService.fetch(options);
      },
      updateMePreference: function(payload) {
        var options = {
          data: payload,
          url: "me/preferences"
        };
        return baseService.update(options);
      },
      me: function() {
        meDeferred = $.Deferred();
        me(meDeferred);
        return meDeferred;
      },
      getJwtToken: function(payload) {
        getJwtTokenDeferred = $.Deferred();
        getJwtToken(getJwtTokenDeferred, payload);
        return getJwtTokenDeferred;
      },
      getPayeeList: function() {
        getPayeeListDeferred = $.Deferred();
        getPayeeList(getPayeeListDeferred);
        return getPayeeListDeferred;
      }
    };
  };
  return new SecurityLandingModel();
});
