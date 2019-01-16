define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  var UserGroupReviewModel = function() {
    var Model = function() {
        this.UserModel = {
          userID: null,
          userName: null
        };
      },
      baseService = BaseService.getInstance(),
      fetchPartyDetailsDeferred, fetchPartyDetails = function(partyId, deferred) {
        var options = {
          url: "administration/parties/" + partyId,
          success: function(data) {
            deferred.resolve(data);
          },
          failure: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
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
      fetchPartyDetails: function(partyId) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyId, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      },
      validateUser: function(userId) {
        validateUserDeferred = $.Deferred();
        validateUser(userId, validateUserDeferred);
        return validateUserDeferred;
      }
    };
  };
  return new UserGroupReviewModel();
});