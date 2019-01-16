define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";
  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  var UserGroupReviewModel = function () {
    var UserModel = function () {
      this.userID = null;
      this.userName = null;
    };
    var baseService = BaseService.getInstance(),
      saveModelDeferred, saveModel = function (model, userGroupId, deferred) {
        var options = {
          url: "userGroups/" + userGroupId,
          data: model,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
        baseService.update(options);
      },
      validateUserDeferred, validateUser = function (userId, deferred) {
        var options = {
          url: "users/{userId}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, {
          "userId": userId
        });
      },
      createUserDeferred, createUser = function (deferred, userId) {
        var options = {
          url: "users/" + userId,
          success: function (data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchUserDetailsDeferred, fetchUserDetails = function (userId, deferred) {
        var options = {
          url: "users/" + userId,
          success: function (data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchUserDetails: function (userId) {
        fetchUserDetailsDeferred = $.Deferred();
        fetchUserDetails(userId, fetchUserDetailsDeferred);
        return fetchUserDetailsDeferred;
      },
      validateUser: function (userId) {
        validateUserDeferred = $.Deferred();
        validateUser(userId, validateUserDeferred);
        return validateUserDeferred;
      },
      createUser: function (userId) {
        createUserDeferred = $.Deferred();
        createUser(createUserDeferred, userId);
        return createUserDeferred;
      },
      getUserModel: function () {
        return new UserModel();
      },
      saveModel: function (userGroupModel, userGroupId) {
        saveModelDeferred = $.Deferred();
        saveModel(userGroupModel, userGroupId, saveModelDeferred);
        return saveModelDeferred;
      }
    };
  };
  return new UserGroupReviewModel();
});