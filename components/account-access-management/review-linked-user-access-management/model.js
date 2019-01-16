define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var reviewLinkedUserAccountAccessModel = function() {
    var baseService = BaseService.getInstance();

    /**
     * This function fetches the Account access details for the given partyId and userID
     * @params {deferred} - object to trach completion of the request
     * {payload} - payload of batch service
     * @function readUserAccountAccess
     * @memberOf ExclusionModel
     **/
    var readAllUserAccountDetailsDeferred, readAllUserAccountDetails = function(partyId, userId, deferred) {

        var options = {
          url: "accountAccess?partyId=" + partyId + "&userId=" + userId + "&accountType=CSA&accountType=TRD&accountType=LON",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       * This function creates the access
       * @params {deferred} - object to trach completion of Batch call
       * {payload} - payload of batch service
       * @function readUserAccountAccess
       * @memberOf ExclusionModel
       **/
      readUserDetailsDeferred, readUserDetails = function(userId, deferred) {
        var options = {
          url: "users/" + userId,
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
      readAllUserAccountDetails: function(partyId, userId) {
        readAllUserAccountDetailsDeferred = $.Deferred();
        readAllUserAccountDetails(partyId, userId, readAllUserAccountDetailsDeferred);
        return readAllUserAccountDetailsDeferred;
      },
      readUserDetails: function(userId) {
        readUserDetailsDeferred = $.Deferred();
        readUserDetails(userId, readUserDetailsDeferred);
        return readUserDetailsDeferred;
      }
    };
  };
  return new reviewLinkedUserAccountAccessModel();
});