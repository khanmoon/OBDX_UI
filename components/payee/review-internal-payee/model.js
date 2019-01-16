define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var reviewInternalPayeeModel = function() {
    var baseService = BaseService.getInstance(),
      getBranchesDeferred, getBranches = function(deferred) {
        var options = {
          url: "locations/country/all/city/all/branchCode/",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getpayeeDetailsDeferred, getDetails = function(groupId, payeeId, deferred) {
        var options = {
          url: "payments/payeeGroup/" + groupId + "/payees/internal/" + payeeId,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getBranchCodeMaskPositionDeferred, getBranchCodeMaskPosition = function(deferred) {
        var options = {
          url: "configurations/base/ExtSystemsConfig/properties/extsystem.branch.code.mask.position",
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
      getBranches: function() {
        getBranchesDeferred = $.Deferred();
        getBranches(getBranchesDeferred);
        return getBranchesDeferred;
      },
      getDetails: function(groupId, payeeId) {
        getpayeeDetailsDeferred = $.Deferred();
        getDetails(groupId, payeeId, getpayeeDetailsDeferred);
        return getpayeeDetailsDeferred;
      },
      getBranchCodeMaskPosition: function() {
        getBranchCodeMaskPositionDeferred = $.Deferred();
        getBranchCodeMaskPosition(getBranchCodeMaskPositionDeferred);
        return getBranchCodeMaskPositionDeferred;
      }
    };
  };
  return new reviewInternalPayeeModel();
});