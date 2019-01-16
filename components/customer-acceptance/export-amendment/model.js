define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var ExportAmendmentModel = function() {
    var baseService = BaseService.getInstance();
    var exportAmendmentListDeffered, getExportAmendments = function(partyId, applicantName, lcNumber, deferred) {
        var options = {
            url: "letterofcredits/amendments?letterOfCreditId=" + lcNumber + "&partyId=" + partyId + "&applicantName=" + applicantName + "&amendStatus=UNCONFIRMED",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "lcNumber": lcNumber,
            "partyId": partyId,
            "applicantName": applicantName
          };
        baseService.fetch(options, params);
      },
      getAmmendmentDetailsDeferred, getAmendmentDetails = function(letterOfCreditId, amendmentId, deferred) {
        var options = {
            url: "letterofcredits/{letterOfCreditId}/amendments/{amendmentId}?amendStatus=UNCONFIRMED&authStatus=UNAUTHORIZED",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "letterOfCreditId": letterOfCreditId,
            "amendmentId": amendmentId
          };
        baseService.fetch(options, params);
      },
      fetchPartyRelationsDeferred, fetchPartyRelations = function(deferred) {
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
      };
    return {
      getExportAmendments: function(partyId, applicantName, lcNumber) {
        exportAmendmentListDeffered = $.Deferred();
        getExportAmendments(partyId, applicantName, lcNumber, exportAmendmentListDeffered);
        return exportAmendmentListDeffered;
      },
      getAmendmentDetails: function(letterOfCreditId, amendmentId) {
        getAmmendmentDetailsDeferred = $.Deferred();
        getAmendmentDetails(letterOfCreditId, amendmentId, getAmmendmentDetailsDeferred);
        return getAmmendmentDetailsDeferred;
      },
      fetchPartyRelations: function() {
        fetchPartyRelationsDeferred = $.Deferred();
        fetchPartyRelations(fetchPartyRelationsDeferred);
        return fetchPartyRelationsDeferred;
      },
      fetchPartyDetails: function(partyId) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyId, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      }
    };
  };
  return new ExportAmendmentModel();
});