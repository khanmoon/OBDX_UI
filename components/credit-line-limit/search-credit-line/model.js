define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var SearchCreditLineModel = function() {
    var fetchPartyRelationsDeferred, fetchPartyRelations = function(deferred) {
        var options = {
          url: "me/party/relations",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchPartyDeferred, fetchParty = function(partyId, deferred) {
        var options = {
          url: "me/party",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchPartyDetailsDeferred, fetchPartyDetails = function(partyId, deferred) {
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
      },
      getCreditLimitsDeferred, getCreditLimits = function(partyId, deferred) {
        var lineLimitUrl;
        if (partyId === "ALL") {
          lineLimitUrl = "parties/lineLimit";
        } else {
          lineLimitUrl = "parties/lineLimit?partyId=" + partyId;
        }
        var options = {
          url: lineLimitUrl,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getLimitDetailsDeferred, getLimitDetails = function(partyId, lineId, deferred) {
        var options = {
            url: "parties/lineLimit/{lineId}?partyId={partyId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "lineId": lineId,
            "partyId": partyId
          };
        baseService.fetch(options, params);
      };
    return {
      fetchPartyRelations: function() {
        fetchPartyRelationsDeferred = $.Deferred();
        fetchPartyRelations(fetchPartyRelationsDeferred);
        return fetchPartyRelationsDeferred;
      },
      fetchParty: function(partyId) {
        fetchPartyDeferred = $.Deferred();
        fetchParty(partyId, fetchPartyDeferred);
        return fetchPartyDeferred;
      },
      fetchPartyDetails: function(partyId) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyId, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      },
      getCreditLimits: function(partyId) {
        getCreditLimitsDeferred = $.Deferred();
        getCreditLimits(partyId, getCreditLimitsDeferred);
        return getCreditLimitsDeferred;
      },
      getLimitDetails: function(partyId, lineId) {
        getLimitDetailsDeferred = $.Deferred();
        getLimitDetails(partyId, lineId, getLimitDetailsDeferred);
        return getLimitDetailsDeferred;
      }
    };
  };
  return new SearchCreditLineModel();
});