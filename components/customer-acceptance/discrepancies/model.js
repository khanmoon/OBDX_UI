define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var DiscrepanciesModel = function() {

    var fetchPartyRelationsDeferred, fetchPartyRelations = function(deferred) {
        var options = {
          url: "me/party/relations",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchPartyDetailsDeferred, fetchPartyDetails = function(partyId, deferred) {
        var options = {
          url: "me/party",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      listDiscrepanciesDeferred, listDiscrepancies = function(partyId, counterPartyName, id, deferred) {
        var options = {
          url: "bills/discrepancies?partyId=" + partyId + "&counterPartyName=" + counterPartyName + "&id=" + id,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getBillDiscrepanciesDetailsDeferred, getBillDiscrepanciesDetails = function(billNumber, deferred) {
        var options = {
          url: "bills/discrepancies/" + billNumber,
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
      fetchPartyRelations: function() {
        fetchPartyRelationsDeferred = $.Deferred();
        fetchPartyRelations(fetchPartyRelationsDeferred);
        return fetchPartyRelationsDeferred;
      },
      fetchPartyDetails: function(partyId) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyId, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      },
      listDiscrepancies: function(partyId, counterPartyName, id) {
        listDiscrepanciesDeferred = $.Deferred();
        listDiscrepancies(partyId, counterPartyName, id, listDiscrepanciesDeferred);
        return listDiscrepanciesDeferred;
      },
      getBillDiscrepanciesDetails: function(billNumber) {
        getBillDiscrepanciesDetailsDeferred = $.Deferred();
        getBillDiscrepanciesDetails(billNumber, getBillDiscrepanciesDetailsDeferred);
        return getBillDiscrepanciesDetailsDeferred;
      }
    };
  };
  return new DiscrepanciesModel();
});