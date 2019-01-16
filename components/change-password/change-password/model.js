define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model file for changing password. This file contains the model definition
   * for change-password and exports the ChangePasswordModel model which can be used
   * as a component.
   *
   * @namespace ChangePassword~ChangePasswordModel
   * @class
   * @property {Object} Model - Object containing the old and new password's values
   * @property {string} Model.oldPassword - value of old password entered
   * @property {string} Model.changedPassword - value of new password entered
   */
  var ChangePasswordModel = function() {
    var Model = function() {
        this.oldPassword = null;
        this.changedPassword = null;
      },
      baseService = BaseService.getInstance(),
      changePasswordDeferred, fetchPasswordPolicyDeferred,
      /**
       * Function executes the "PUT" request to for changing password
       * @function changePassword
       * @memberOf ChangePasswordModel
       * @param {payload} - expected data for service
       * @param {deferred} - resolved after successful execution or rejected after failure
       **/
      changePassword = function(payload, deferred) {
        var options = {
          url: "me/credentials",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.update(options);
      };
    /**
     * Function executes the "GET" request to fetch the password policy
     * @function fetchPasswordPolicy
     * @memberOf ChangePasswordModel
     * @param {payload} - expected data for service
     * @param {deferred} - resolved after successful execution or rejected after failure
     **/
    var fetchPasswordPolicy = function(searchParams, deferred) {
      var roles = "";
      for (var i = 0; i < searchParams.roles.length; i++) {
        roles = roles + "roles=" + searchParams.roles[i] + "&";
      }
      var options = {
        url: "passwordPolicy?" + roles +"display=true",
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
      getNewModel: function() {
        return new Model();
      },
      changePassword: function(payload) {
        changePasswordDeferred = $.Deferred();
        changePassword(payload, changePasswordDeferred);
        return changePasswordDeferred;
      },
      fetchPasswordPolicy: function(params) {
        fetchPasswordPolicyDeferred = $.Deferred();
        fetchPasswordPolicy(params, fetchPasswordPolicyDeferred);
        return fetchPasswordPolicyDeferred;
      }
    };
  };
  return new ChangePasswordModel();
});