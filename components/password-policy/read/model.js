define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var PasswordPolicyReadModel = function() {
    var Model = function() {
      this.checkboxValues = {
        "lowerCaseMandatory": "lowerCaseMandatory",
        "upperMandatory": "upperMandatory",
        "specialCharMandatory": "specialCharMandatory",
        "numericMandatory": "numericMandatory"
      };
    };
    /**
     * This function fires a GET request to fetch the user groups options
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function fetchUserGroupOptions
     * @memberOf PasswordPolicyEditModel

     * @example PasswordPolicyEditModel.fetchUserGroupOptions();
     */
    var
      fetchUserGroupOptionsDeferred, fetchUserGroupOptions = function(deferred) {
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
      };

    var fetchPasswordPolicyDetailsDeferred, fetchPasswordPolicyDetails = function(id, deferred) {
      var options = {
        url: "passwordPolicy/" + id,
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    var deletePasswordPolicyDeferred, deletePasswordPolicy = function(id, deferred) {
      var options = {
        url: "passwordPolicy/" + id,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };
      baseService.remove(options);
    };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      fetchUserGroupOptions: function() {
        fetchUserGroupOptionsDeferred = $.Deferred();
        fetchUserGroupOptions(fetchUserGroupOptionsDeferred);
        return fetchUserGroupOptionsDeferred;
      },
      fetchPasswordPolicyDetails: function(id) {
        fetchPasswordPolicyDetailsDeferred = $.Deferred();
        fetchPasswordPolicyDetails(id, fetchPasswordPolicyDetailsDeferred);
        return fetchPasswordPolicyDetailsDeferred;
      },
      deletePasswordPolicy: function(id) {
        deletePasswordPolicyDeferred = $.Deferred();
        deletePasswordPolicy(id, deletePasswordPolicyDeferred);
        return deletePasswordPolicyDeferred;
      }

    };
  };
  return new PasswordPolicyReadModel();
});