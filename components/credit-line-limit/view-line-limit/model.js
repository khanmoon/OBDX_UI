define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var ViewLineLimitModel = function() {
    var fetchPartyDetailsDeferred, fetchPartyDetails = function(partyId, deferred) {
      var params = {
          "partyId": partyId
        },
        options = {
          url: "me/party/relations/{partyId}",
          success: function(data) {
            deferred.resolve(data);
          }
        };
      baseService.fetch(options, params);
    };
    return {
      fetchPartyDetails: function(partyId) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyId, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      }
    };
  };
  return new ViewLineLimitModel();
});