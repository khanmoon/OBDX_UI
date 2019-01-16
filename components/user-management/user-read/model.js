define([
  "jquery",
  "baseService",
  "baseLogger"
], function($, BaseService) {
  "use strict";
  /**
   * Model for UsersCreateModel section
   *
   * @namespace UsersCreateModel code~UsersCreateModel
   * @class
   */
  var UserReadModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @private
     */
    var baseService = BaseService.getInstance(),
      params,
      fetchChildRoleDeferred, fetchChildRole = function(enterpriseRoleId, deferred) {
        var options = {
          url: "applicationRoles?accessPointType=INT&enterpriseRole=" + enterpriseRoleId,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      fetchAccessDeferred, fetchAccess = function(searchParams, deferred) {
          var options = {
              url: "accessPoints?accessType=All",
              success: function(data) {
                  deferred.resolve(data);
              }
          };
          baseService.fetch(options, searchParams);
      },
      getEnterpriseRolesDeferred,
      getEnterpriseRoles = function(deferred) {
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

      resetPasswordDeferred, resetPassword = function(username, deferred) {
        var params = {
            "userId": username
          },
          options = {
            url: "users/" + username + "/resetCredentials",
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          };
        baseService.update(options, params);
      },
      readUserDeferred, readUser = function(id, deferred) {
        var params = {
            "userId": id
          },
          options = {
            url: "users/" + id,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      downloadUserDetails = function(id) {
        var params = {
          "userId": id
        },
        options = {
          url: "users/" + id + "?media=text/csv&mediaFormat=csv"
        };
        baseService.downloadFile(options, params);
      },
      fetchDeviceCountDeferred, fetchDeviceCount = function(username, deferred) {
        var params = {
            "userId": username
          },
          options = {
            url: "mobileClient/registeredDevices/{userId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },fetchDeviceCountForPushNotificationDeferred, fetchDeviceCountForPushNotification = function(username, deferred) {
        var params = {
            "userId": username
          },
          options = {
            url: "mobileClient/registeredPushToken/{userId}",
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
      fetchChildRole: function(enterpriseRoleId) {
        fetchChildRoleDeferred = $.Deferred();
        fetchChildRole(enterpriseRoleId, fetchChildRoleDeferred);
        return fetchChildRoleDeferred;
      },
      resetPassword: function(username) {
        resetPasswordDeferred = $.Deferred();
        resetPassword(username, resetPasswordDeferred);
        return resetPasswordDeferred;
      },
      readUser: function(Parameters) {
        readUserDeferred = $.Deferred();
        readUser(Parameters, readUserDeferred);
        return readUserDeferred;
      },
      downloadUserDetails: function(Parameters) {
        downloadUserDetails(Parameters);
      },
      fetchDeviceCount: function(Parameters) {
        fetchDeviceCountDeferred = $.Deferred();
        fetchDeviceCount(Parameters, fetchDeviceCountDeferred);
        return fetchDeviceCountDeferred;
      },
        fetchDeviceCountForPushNotification: function(Parameters) {
        fetchDeviceCountForPushNotificationDeferred = $.Deferred();
        fetchDeviceCountForPushNotification(Parameters, fetchDeviceCountForPushNotificationDeferred);
        return fetchDeviceCountForPushNotificationDeferred;
      },
      getEnterpriseRoles: function() {
        getEnterpriseRolesDeferred = $.Deferred();
        getEnterpriseRoles(getEnterpriseRolesDeferred);
        return getEnterpriseRolesDeferred;
      },
      fetchAccess: function(searchParams) {
          fetchAccessDeferred = $.Deferred();
          fetchAccess(searchParams, fetchAccessDeferred);
          return fetchAccessDeferred;
      },
      /**
       * listAccessPointGroup - fetches the AccessPointGroup List
       * @returns {Promise}  Returns the promise object
       */
      listAccessPointGroup: function() {
        var options = {
          url: "accessPointGroups"
        };
        return baseService.fetch(options);
      }
    };
  };
  return new UserReadModel();
});
