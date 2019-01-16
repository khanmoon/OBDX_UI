define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var reviewLinkedPartyAccountAccessModel = function() {
    var baseService = BaseService.getInstance();

    /**
     * This function creates the access
     * @params {deferred} - object to trach completion of Batch call
     * {payload} - payload of batch service
     * @function readUserAccountAccess
     * @memberOf ExclusionModel
     **/
    var readAllAccountDetailsDeferred, readAllAccountDetails = function(partyId, userId, deferred) {
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
    };
    return {

      readAllAccountDetails: function(partyId, userId) {
        readAllAccountDetailsDeferred = $.Deferred();
        readAllAccountDetails(partyId, userId, readAllAccountDetailsDeferred);
        return readAllAccountDetailsDeferred;
      }
    };
  };
  return new reviewLinkedPartyAccountAccessModel();
});