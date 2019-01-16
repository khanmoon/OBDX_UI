define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var UserGroupSubjectMapSearchModel = function() {
    var baseService = BaseService.getInstance();
    /**
     * In case more than one instance of model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf ExclusionModel~ExclusionModel
     */
    var
      fetchUserGroupListDeferred, fetchUserGroupList = function(deferred) {
        var options = {
          url: "userGroups?userGroupType=ADMIN",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchMappinListDeferred, fetchMappinList = function(parameters, deferred) {
        var params = {
            "mappingCode": parameters.mappingCode,
            "mappingDescription": parameters.mappingDesc,
            "groupId": parameters.groupId
          },
          options = {
            url: "userGroupSubjectMap?mappingCode={mappingCode}&mappingDescription={mappingDescription}&groupId={groupId}",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      };
    return {
      fetchUserGroupList: function() {
        fetchUserGroupListDeferred = $.Deferred();
        fetchUserGroupList(fetchUserGroupListDeferred);
        return fetchUserGroupListDeferred;
      },
      fetchMappinList: function(parameters) {
        fetchMappinListDeferred = $.Deferred();
        fetchMappinList(parameters, fetchMappinListDeferred);
        return fetchMappinListDeferred;
      },
      init: function() {
        var modelInitialized = true;
        return modelInitialized;
      }
    };
  };
  return new UserGroupSubjectMapSearchModel();
});