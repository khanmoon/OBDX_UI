define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var ReviewAmendLcModel = function() {
    var baseService = BaseService.getInstance();
    var Model = function() {
      this.ExportAmendAcceptanceDetails = {
        "customerAcceptanceStatus": null,
        "counterPartyName": null,
        "newAmount": {
          "currency": null,
          "amount": null
        }
      };
    };
    var initiateAmendmentDeferred, initiateAmendment = function(letterOfCreditId, model, deferred) {
        var params = {
            "letterOfCreditId": letterOfCreditId
          },
          options = {
            url: "letterofcredits/{letterOfCreditId}/amendments",
            data: model,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          };
        baseService.add(options, params);
      },
      acceptanceDeferred, exportAmendAcceptance = function(letterOfCreditId, noOfAmendment, model, deferred) {
        var params = {
            "letterOfCreditId": letterOfCreditId,
            "noOfAmendment": noOfAmendment
          },
          options = {
            url: "letterofcredits/{letterOfCreditId}/amendments/{noOfAmendment}/acceptance",
            data: model,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          };
        baseService.add(options, params);
      },
      getImportLCDeferred, getImportLC = function(lcNumber, versionNo, deferred) {
        var options = {
            url: "letterofcredits/{lcNumber}?versionNo=" + versionNo,
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
      },
      fetchPartyDetailsDeferred, fetchPartyDetails = function(partyID, deferred) {
        var params = {
            "partyId": partyID
          },
          options = {
            url: "me/party/relations/{partyId}",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      fetchBeniCountryDeferred, fetchBeniCountry = function(deferred) {
        var options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchBranchDeferred, fetchBranch = function(deferred) {
        var options = {
          url: "locations/country/all/city/all/branchCode/",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getBankDetailsBICDeferred, getBankDetailsBIC = function(code, deferred) {
        var options = {
            url: "financialInstitution/bicCodeDetails/{BICCode}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "BICCode": code
          };
        baseService.fetch(options, params);
      },
      fetchBranchDateDeferred, fetchBranchDate = function(code, deferred) {
        var options = {
            url: "branchdate/{branchCode}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "branchCode": code
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
      fetchIncotermDeferred, fetchIncoterm = function(code, deferred) {
        var options = {
          url: "letterofcredits/incoterms?code=" + code,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      initiateAmendment: function(letterOfCreditId, model) {
        initiateAmendmentDeferred = $.Deferred();
        initiateAmendment(letterOfCreditId, model, initiateAmendmentDeferred);
        return initiateAmendmentDeferred;
      },
      exportAmendAcceptance: function(letterOfCreditId, noOfAmendment, model) {
        acceptanceDeferred = $.Deferred();
        exportAmendAcceptance(letterOfCreditId, noOfAmendment, model, acceptanceDeferred);
        return acceptanceDeferred;
      },
      getImportLC: function(lcNumber, versionNo) {
        getImportLCDeferred = $.Deferred();
        getImportLC(lcNumber, versionNo, getImportLCDeferred);
        return getImportLCDeferred;
      },
      fetchPartyDetails: function(partyID) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyID, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      },
      fetchBeniCountry: function() {
        fetchBeniCountryDeferred = $.Deferred();
        fetchBeniCountry(fetchBeniCountryDeferred);
        return fetchBeniCountryDeferred;
      },
      fetchBranch: function() {
        fetchBranchDeferred = $.Deferred();
        fetchBranch(fetchBranchDeferred);
        return fetchBranchDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);
        return getBankDetailsBICDeferred;
      },
      fetchBranchDate: function(code) {
        fetchBranchDateDeferred = $.Deferred();
        fetchBranchDate(code, fetchBranchDateDeferred);
        return fetchBranchDateDeferred;
      },
      getAmendmentDetails: function(letterOfCreditId, amendmentId) {
        getAmmendmentDetailsDeferred = $.Deferred();
        getAmendmentDetails(letterOfCreditId, amendmentId, getAmmendmentDetailsDeferred);
        return getAmmendmentDetailsDeferred;
      },
      fetchIncoterm: function(code) {
        fetchIncotermDeferred = $.Deferred();
        fetchIncoterm(code, fetchIncotermDeferred);
        return fetchIncotermDeferred;
      }
    };
  };
  return new ReviewAmendLcModel();
});