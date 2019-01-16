/** Model for Transaction Mapping Search
 * @param {object} BaseService
 * @return {object} TransactionMappingSearchModel
 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var TransactionMappingSearchModel = function() {
    /**
    * baseService instance through which all the rest calls will be made.
    *
    * @attribute baseService
    * @type {Object} BaseService Instance
    * @private
    */
    var baseService = BaseService.getInstance();
    this.getNewModel = function() {
      return new this.Model();
    };
    var fetchUserGroupOptionsDeferred, fetchUserGroupOptions = function(deferred) {
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
      fetchUserGroupListOptionsDeferred, fetchUserGroupListOptions = function(Parameters, deferred) {
        var params = {
            "applicationRoleName": Parameters.applicationRoleName,
            "enterpriseRole": Parameters.enterpriseRole
          },
          options = {
            url: "applicationRoles?applicationRoleName={applicationRoleName}&enterpriseRole={enterpriseRole}&isLocal=true",
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
      fetchUserGroupOptions: function() {
        fetchUserGroupOptionsDeferred = $.Deferred();
        fetchUserGroupOptions(fetchUserGroupOptionsDeferred);
        return fetchUserGroupOptionsDeferred;
      },
      fetchUserGroupListOptions: function(Parameters) {
        fetchUserGroupListOptionsDeferred = $.Deferred();
        fetchUserGroupListOptions(Parameters, fetchUserGroupListOptionsDeferred);
        return fetchUserGroupListOptionsDeferred;
      }
    };
  };
  return new TransactionMappingSearchModel();
});
