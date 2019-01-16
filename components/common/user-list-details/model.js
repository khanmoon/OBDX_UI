define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var UserListDetailsModel = function() {
    var baseService = BaseService.getInstance();

    var fetchAssociatedUserForPartyDeferred,
      fetchAssociatedUserForParty = function(partyID, deferred) {
        var params = {
            "partyId": partyID

          },

          options = {
            url: "users?partyId={partyId}&isAccessSetupCheckRequired=true",
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
      fetchAssociatedUserForParty: function(batchData) {
        fetchAssociatedUserForPartyDeferred = $.Deferred();
        fetchAssociatedUserForParty(batchData, fetchAssociatedUserForPartyDeferred);
        return fetchAssociatedUserForPartyDeferred;
      }
    };

  };
  return new UserListDetailsModel();
});