define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var UsersModel = function() {
    var baseService = BaseService.getInstance();
    /**
     * Function to get new instance of ApplicationRolesCreateModel
     *
     * @function
     * @memberOf UsersModel
     * @returns Model
     */
    var

      /**
     * This function fires a GET request to fetch the user groups options
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function fetchUserGroupOptions
     * @memberOf UsersCreateModel

     * @example UsersCreateModel.fetchUserGroupOptions();
     */
      fetchUserGroupOptionsDeferred, fetchUserGroupOptions = function(deferred) {
        var params = {
            "isLocal": true
          },
          options = {
            url: "enterpriseRoles?isLocal={isLocal}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      fetchCountryDeferred, fetchCountry = function(deferred) {
        var options = {
          url: "enumerations/country",
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
      fetchCountry: function() {
        fetchCountryDeferred = $.Deferred();
        fetchCountry(fetchCountryDeferred);
        return fetchCountryDeferred;
      },
      fetchUserGroupOptions: function() {
        fetchUserGroupOptionsDeferred = $.Deferred();
        fetchUserGroupOptions(fetchUserGroupOptionsDeferred);
        return fetchUserGroupOptionsDeferred;
      }

    };
  };
  return new UsersModel();
});