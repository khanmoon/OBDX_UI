define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var Mails = function() {
    var baseService = BaseService.getInstance(),
      fetchMailsDeffered, fetchMails = function(deffered) {
        var options = {
          url: "accounts",

          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchMails: function() {
        fetchMailsDeffered = $.Deferred();
        fetchMails(fetchMailsDeffered);
        return fetchMailsDeffered;
      }
    };
  };
  return new Mails();
});