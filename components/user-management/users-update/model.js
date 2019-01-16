define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for UsersUpdateModel section
   *
   * @namespace UsersUpdateModel code~UsersUpdateModel
   * @class
   */
  var UsersUpdateModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @private
     */
    var baseService = BaseService.getInstance();
    var
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/

      /**
       * This function fires a POST request to update user details
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       *
       * @function updateUser
       * @memberOf UsersUpdateModel
       * @param {String} payload  -  indicates the form details to be updated filled by admin

       * @example UsersUpdateModel.updateUser(data);
       */
      updateUserDeferred, updateUser = function(payload, id, deferred) {
        var params = {
            "userId": id
          },
          options = {
            url: "users/{userId}",
            data: payload,
            success: function(payload, status, jqXhr) {
              deferred.resolve(payload, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };
        baseService.update(options, params);

      },
      fetchAccessDeferred, fetchAccess = function(searchParams, deferred) {
          var options = {
              url: "accessPoints?accessType={accessType}",
              success: function(data) {
                  deferred.resolve(data);
              }
          };
          baseService.fetch(options, searchParams);
      },
      fetchUserLimitOptionsDeferred, fetchUserLimitOptions = function(deferred, businessEntity, assignableEntitiesData) {
        var params = {
            "assignableEntitiesData": assignableEntitiesData
          },
          options = {
            url: "limitPackages?assignableEntities={assignableEntitiesData}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        if (businessEntity) {
          options.headers = {
            "X-Target-Unit": businessEntity
          };
        }
        baseService.fetch(options, params);
      },
      /**
       * This function read the entities
       * @params {deferred} - object to trach completion of network call
       * @function fetchEntitites
       * @memberOf ExclusionModel
       **/
      fetchEntititesDeferred, fetchEntitites = function(deferred) {
        var options = {
          url: "entities",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      updateUser: function(payload, id) {
        updateUserDeferred = $.Deferred();
        updateUser(payload, id, updateUserDeferred);
        return updateUserDeferred;
      },
      fetchUserLimitOptions: function(businessEntity, assignableEntitiesData) {
        fetchUserLimitOptionsDeferred = $.Deferred();
        fetchUserLimitOptions(fetchUserLimitOptionsDeferred, businessEntity, assignableEntitiesData);
        return fetchUserLimitOptionsDeferred;
      },
      fetchEntitites: function() {
        fetchEntititesDeferred = $.Deferred();
        fetchEntitites(fetchEntititesDeferred);
        return fetchEntititesDeferred;
      },
      fetchAccess: function(searchParams) {
          fetchAccessDeferred = $.Deferred();
          fetchAccess(searchParams, fetchAccessDeferred);
          return fetchAccessDeferred;
      }
    };
  };
  return new UsersUpdateModel();
});
