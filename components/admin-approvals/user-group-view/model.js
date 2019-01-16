define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var UserGroupViewModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance();
    var Model = function() {
      return {
        UserGroup : {
          "name": null,
          "type": "CUSTOMER",
          "version": null,
          "partyId": null,
          "unary": false,
          "users": []
        }
      };
      },
      UserModel = function() {
        return {userID : null,
userName : null};
      },
      fetchUserListDeferred, fetchUserList = function(deferred) {
        var options = {
          url: "users?userGroup=Administrator",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      saveModelDeferred, saveModel = function(model, userGroupId, deferred) {
        var options = {
            url: "userGroups/{userGroupId}",
            data: model,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          },
          params = {
            "userGroupId": userGroupId,
            "model": model
          };
        baseService.update(options, params);
      },
      createUserGroupDeferred, createUserGroup = function(model, deferred) {
        var options = {
            url: "userGroups",
            data: model,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          },
          params = {
            "model": model
          };
        baseService.add(options, params);
      },
      deleteUserFromGroupDeferred, deleteUserFromGroup = function(userGroupId, deferred) {
        var options = {
            url: "userGroups/{userGroupId}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "userGroupId": userGroupId
          };
        baseService.remove(options, params);
      },
      fetchUserGroupDeferred, fetchUserGroup = function(deferred, userId) {
        var options = {
            url: "userGroups/{userId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "userId": userId
          };
        baseService.fetch(options, params);
      },
      deleteUserGroupDeferred, deleteUserGroup = function(userGroupId, deferred) {
        var options = {
            url: "userGroups/{userGroupId}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "userGroupId": userGroupId
          };
        baseService.remove(options, params);
      },
      editUserGroupDeferred, editUserGroup = function(userGroupId, deferred) {
        var options = {
            url: "userGroups/{userGroupId}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "userGroupId": userGroupId
          };
        baseService.remove(options, params);
      },
      validateUserDeferred, validateUser = function(userId, deferred) {
        var options = {
          url: "users/{userId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, {
          "userId": userId
        });
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      fetchUserList: function() {
        fetchUserListDeferred = $.Deferred();
        fetchUserList(fetchUserListDeferred);
        return fetchUserListDeferred;
      },
      validateUser: function(userId) {
        validateUserDeferred = $.Deferred();
        validateUser(userId, validateUserDeferred);
        return validateUserDeferred;
      },
      getUserModel: function() {
        return new UserModel();
      },
      deleteUserFromGroup: function(userGroupId) {
        deleteUserFromGroupDeferred = $.Deferred();
        deleteUserFromGroup(userGroupId, deleteUserFromGroupDeferred);
        return deleteUserFromGroupDeferred;
      },
      fetchUserGroup: function(userId) {
        fetchUserGroupDeferred = $.Deferred();
        fetchUserGroup(fetchUserGroupDeferred, userId);
        return fetchUserGroupDeferred;
      },
      deleteUserGroup: function(userGroupId) {
        deleteUserGroupDeferred = $.Deferred();
        deleteUserGroup(userGroupId, deleteUserGroupDeferred);
        return deleteUserGroupDeferred;
      },
      editUserGroup: function(userGroupId) {
        editUserGroupDeferred = $.Deferred();
        editUserGroup(userGroupId, editUserGroupDeferred);
        return editUserGroupDeferred;
      },
      saveModel: function(userGroupModel, userGroupId) {
        saveModelDeferred = $.Deferred();
        saveModel(userGroupModel, userGroupId, saveModelDeferred);
        return saveModelDeferred;
      },
      createUserGroup: function(userGroupModel) {
        createUserGroupDeferred = $.Deferred();
        createUserGroup(userGroupModel, createUserGroupDeferred);
        return createUserGroupDeferred;
      }
    };
  };
  return new UserGroupViewModel();
});
