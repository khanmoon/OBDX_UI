define([
  "jquery",
  "baseService"

], function($, BaseService) {
  "use strict";
  var MailerBaseModel = function() {

    var baseService = BaseService.getInstance();

    var fetchMailersListDeferred, fetchMailersList = function(description, code, deferred) {
      var params = {
          "description": description || "",
          "code": code || ""

        },

        options = {
          url: "mailers?description={description}&code={code}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
      baseService.fetch(options, params);
    };

    return {
      fetchMailersList: function(description, code) {

        fetchMailersListDeferred = $.Deferred();
        fetchMailersList(description, code, fetchMailersListDeferred);
        return fetchMailersListDeferred;
      }
    };
  };
  return new MailerBaseModel();
});