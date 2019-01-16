define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var UserGroupListModel = function() {
    var baseService = BaseService.getInstance();
    var Model = function() {
        this.approvals = {
          "partyId": null,
          "userType": "CUSTOMER",
          "partyName": null,
          "partyDetailsFetched": false,
          "additionalDetails": "",
          "userTypeLabel": ""
        };
      },
      fetchUserGroupSearchListDeferred, fetchUserGroupSearchList = function(deferred, userType, partyId, userGroupName, userId) {
        userType = "CUSTOMER";
        var options = {
          url: "userGroups?partyId=" + partyId + "&userGroupName=" + userGroupName + "&userId=" + userId + "&userGroupType=" + userType,
          selfLoader: false,
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
      fetchUserGroupSearchList: function(userType, partyId, userGroupName, userId) {
        fetchUserGroupSearchListDeferred = $.Deferred();
        fetchUserGroupSearchList(fetchUserGroupSearchListDeferred, userType, partyId, userGroupName, userId);
        return fetchUserGroupSearchListDeferred;
      }
    };
  };
  return new UserGroupListModel();
});