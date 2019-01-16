define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var LcLookupModel = function() {
    var Model = function() {
      this.model = {
        "lcType": "Export",
        "beneName": "",
        "lcStatus": "ACTIVE",
        "fromAmount": "",
        "toAmount": "",
        "status": "",
        "lcNumber": "",
        "applicantName": ""
      };
    };

    var baseService = BaseService.getInstance();
    var Deferred,
      getExportLCs = function(model, deferred) {
        var options = {
          url: "letterofcredits?lcType=" + model.lcType + "&applicantName=" + model.applicantName + "&lcNumber=" + model.lcNumber + "&partyId=" + model.beneName + "&lcStatus=" + model.lcStatus + "&fromAmount=" + model.fromAmount + "&toAmount=" + model.toAmount + "&status=" + model.status,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
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
      },
      getExportLC = function(lcNumber, deferred) {
        var options = {
            url: "letterofcredits/{lcNumber}?forBillsCreation=true",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "lcNumber": lcNumber
          };
        baseService.fetch(options, params);
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
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
      },
      getExportLCs: function(model) {
        Deferred = $.Deferred();
        getExportLCs(model, Deferred);
        return Deferred;
      },
      getExportLC: function(lcNumber) {
        Deferred = $.Deferred();
        getExportLC(lcNumber, Deferred);
        return Deferred;
      }
    };
  };
  return new LcLookupModel();
});
