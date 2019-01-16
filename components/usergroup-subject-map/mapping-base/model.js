define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var UserGroupSubjectBaseModel = function() {
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
      };
    return {
      fetchUserGroupList: function() {
        fetchUserGroupListDeferred = $.Deferred();
        fetchUserGroupList(fetchUserGroupListDeferred);
        return fetchUserGroupListDeferred;
      }

    };
  };
  return new UserGroupSubjectBaseModel();
});