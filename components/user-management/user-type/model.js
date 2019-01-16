define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for UserTypeModel section
   *
   * @namespace UserTypeModel code~UserTypeModel
   * @class
   */
  var UserTypeModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @private
     */
    var baseService = BaseService.getInstance(),
      params;
    var
      modelInitialized = false,
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/

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
        var options = {
          url: "enterpriseRoles?isLocal=true",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },

      showPartyDetailsDeferred, showPartyDetails = function(deferred) {
        var options = {
          url: "me",
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
      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },
      fetchUserGroupOptions: function() {
        fetchUserGroupOptionsDeferred = $.Deferred();
        fetchUserGroupOptions(fetchUserGroupOptionsDeferred);
        return fetchUserGroupOptionsDeferred;
      },
      showPartyDetails: function() {
        showPartyDetailsDeferred = $.Deferred();
        showPartyDetails(showPartyDetailsDeferred);
        return showPartyDetailsDeferred;
      }
    };
  };
  return new UserTypeModel();
});