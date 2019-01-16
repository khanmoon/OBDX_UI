define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * This file contains all the REST services APIs for the account-input component.
   *
   * @class UserDetailsModel
   * @extends BaseService {@link BaseService}
   * @property {Object} baseService - baseService instance through which all the rest calls will be made.
   * @version Revision
   */
  var UserDetailsModel = function() {
    var baseService = BaseService.getInstance(),
      /**
       * This function uses baseService's fetch to GET list of all the demand deposit accounts.
       * @function fetchUserList
       * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
       */
      fetchUserListDeferred, fetchUserList = function(partyId, deferred) {
        var options = {
          url: "users?partyId=" + partyId,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchAdminUserListDeferred, fetchAdminUserList = function(deferred) {
        var options = {
          url: "users?userGroup=Administrator",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchAdminUserGroupListDeferred, fetchAdminUserGroupList = function(userType, deferred) {
        var options = {
          url: "userGroups?partyId=&userGroupType={userType}",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, {
          userType: userType
        });
      },
      fetchUserGroupListDeferred, fetchUserGroupList = function(partyId, userType, deferred) {
        var options = {
          url: "userGroups?partyId=" + partyId + "&userGroupType=" + userType,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchUserDetailsDeferred, fetchUserDetails = function(userId, deferred) {
        var options = {
          url: "users/" + userId,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };

    return {
      fetchUserList: function(partyId) {
        fetchUserListDeferred = $.Deferred();
        fetchUserList(partyId, fetchUserListDeferred);
        return fetchUserListDeferred;
      },
      fetchUserDetails: function(userId) {
        fetchUserDetailsDeferred = $.Deferred();
        fetchUserDetails(userId, fetchUserDetailsDeferred);
        return fetchUserDetailsDeferred;
      },
      fetchAdminUserList: function() {
        fetchAdminUserListDeferred = $.Deferred();
        fetchAdminUserList(fetchAdminUserListDeferred);
        return fetchAdminUserListDeferred;
      },
      fetchAdminUserGroupList: function(userType) {
        fetchAdminUserGroupListDeferred = $.Deferred();
        fetchAdminUserGroupList(userType, fetchAdminUserGroupListDeferred);
        return fetchAdminUserGroupListDeferred;
      },
      fetchUserGroupList: function(partyId, userType) {
        fetchUserGroupListDeferred = $.Deferred();
        fetchUserGroupList(partyId, userType, fetchUserGroupListDeferred);
        return fetchUserGroupListDeferred;
      }
    };
  };
  return new UserDetailsModel();
});