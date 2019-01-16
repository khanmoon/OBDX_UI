define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ViewDiscrepanciesModel = function() {
    var baseService = BaseService.getInstance(),
      discrepancyModel = function() {
        this.discrepancies = {
          discrepancyDTO: []
        };
      };

    var initiateCustomerAcceptanceDeferred, initiateCustomerAcceptance = function(billReferenceNumber, model, deferred) {
        var options = {
          url: "bills/discrepancies/" + billReferenceNumber + "/customeracceptance",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }

        };
        baseService.add(options);
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
      };
    return {
      getNewdiscrepancyModel: function() {
        return new discrepancyModel();
      },
      initiateCustomerAcceptance: function(billReferenceNumber, model) {
        initiateCustomerAcceptanceDeferred = $.Deferred();
        initiateCustomerAcceptance(billReferenceNumber, model, initiateCustomerAcceptanceDeferred);
        return initiateCustomerAcceptanceDeferred;
      },
      fetchBranchDate: function(code) {
        fetchBranchDateDeferred = $.Deferred();
        fetchBranchDate(code, fetchBranchDateDeferred);
        return fetchBranchDateDeferred;
      }
    };
  };
  return new ViewDiscrepanciesModel();
});
