define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var ReviewBeneMaintenanceModel = function() {
    var createBeneMaintenanceDeferred, createBeneMaintenance = function(model, deferred) {
        var options = {
          url: "beneficiaries",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      deleteBeneficiaryDeffered, deleteBeneficiary = function(beneficiaryId, deferred) {

        var options = {
          url: "beneficiaries/" + beneficiaryId,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.remove(options);
      },
      updateBeneMaintenanceDeferred, updateBeneMaintenance = function(beneficiaryId, model, deferred) {
        var options = {
          url: "beneficiaries/" + beneficiaryId,
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.update(options);
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
      };
    return {
      createBeneMaintenance: function(model) {
        createBeneMaintenanceDeferred = $.Deferred();
        createBeneMaintenance(model, createBeneMaintenanceDeferred);
        return createBeneMaintenanceDeferred;
      },
      deleteBeneficiary: function(beneficiaryId) {
        deleteBeneficiaryDeffered = $.Deferred();
        deleteBeneficiary(beneficiaryId, deleteBeneficiaryDeffered);
        return deleteBeneficiaryDeffered;
      },
      updateBeneMaintenance: function(beneficiaryId, model) {
        updateBeneMaintenanceDeferred = $.Deferred();
        updateBeneMaintenance(beneficiaryId, model, updateBeneMaintenanceDeferred);
        return updateBeneMaintenanceDeferred;
      },
      fetchBeniCountry: function() {
        fetchBeniCountryDeferred = $.Deferred();
        fetchBeniCountry(fetchBeniCountryDeferred);
        return fetchBeniCountryDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);
        return getBankDetailsBICDeferred;
      },
      getBeneficiaryDetails: function(beneficiaryId) {
        beneficiaryDetailsDeferred = $.Deferred();
        getBeneficiaryDetails(beneficiaryId, beneficiaryDetailsDeferred);
        return beneficiaryDetailsDeferred;
      }
    };
  };
  return new ReviewBeneMaintenanceModel();
});