define([
  "jquery",
  "baseService"

], function($, BaseService) {
  "use strict";
  var UsersModel = function() {

    var baseService = BaseService.getInstance();

    var deleteMailerDeffered, deleteMailer = function(mailerId, deferred) {

        var options = {
          url: "mailers/" + mailerId,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }

        };
        baseService.remove(options);
      },

       listEnterpriseRolesDeferred, listEnterpriseRoles = function(deferred) {
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
          },

       readMailerDeffered, readMailer = function(Parameters, deferred) {

        var params = {
            "mailerId": Parameters
          },

          options = {
            url: "mailers/" + Parameters,
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

      deleteMailer: function(mailerId) {
        deleteMailerDeffered = $.Deferred();
        deleteMailer(mailerId, deleteMailerDeffered);
        return deleteMailerDeffered;
      },
      listEnterpriseRoles: function() {
        listEnterpriseRolesDeferred = $.Deferred();
        listEnterpriseRoles(listEnterpriseRolesDeferred);
        return listEnterpriseRolesDeferred;
      },
      readMailer: function(Parameters) {
        readMailerDeffered = $.Deferred();
        readMailer(Parameters, readMailerDeffered);
        return readMailerDeffered;
      }

    };

  };
  return new UsersModel();
});
