define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var SearchBeneMaintenanceModel = function() {
    var beneficiaryListDeferred, getBeneficiaryList = function(deferred) {
        var options = {
          url: "beneficiaries",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      beneficiaryDetailsDeferred, getBeneficiaryDetails = function(beneficiaryId, deferred) {
        var options = {
            url: "beneficiaries/{beneficiaryId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "beneficiaryId": beneficiaryId
          };
        baseService.fetch(options, params);
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
      };
    return {
      getBeneficiaryList: function() {
        beneficiaryListDeferred = $.Deferred();
        getBeneficiaryList(beneficiaryListDeferred);
        return beneficiaryListDeferred;
      },
      getBeneficiaryDetails: function(beneficiaryId) {
        beneficiaryDetailsDeferred = $.Deferred();
        getBeneficiaryDetails(beneficiaryId, beneficiaryDetailsDeferred);
        return beneficiaryDetailsDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);
        return getBankDetailsBICDeferred;
      }
    };
  };
  return new SearchBeneMaintenanceModel();
});