define([
  "jquery",
  "baseService",
  "framework/js/constants/constants-payments"
], function($, BaseService) {
  "use strict";
  var draftModel = function() {
    var baseService = BaseService.getInstance(),
      getDraftDataDeferred, getDraftData = function(paymentId, paymentType, draftType, transferNow, deferred) {
        var url;
        if (transferNow) {
          url = "payments/" + paymentType + "/" + draftType + "/" + paymentId;
        } else {
          url = "payments/instructions/" + paymentType + "/" + draftType + "/" + paymentId;
        }
        var options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getPurposeDescDeferred, getPurposeDesc = function(deferred) {
        var options = {
          url: "purposes/PC",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getDeliveryModeDeferred, getDeliveryMode = function(deferred) {
        var options = {
          url: "enumerations/modeOfDelivery",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getBranchAddressDeferred, getBranchAddress = function(branchCode, deferred) {
        var options = {
            url: "locations/branches?branchCode={branchCode}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "branchCode": branchCode
          };
        baseService.fetch(options, params);
      },
      fetchCourierAddressDeferred, fetchCourierAddress = function(addressType, deferred) {
        var options = {
          url: "me/party",
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
      getDraftData: function(paymentId, paymentType, transferType, transferNow) {

        getDraftDataDeferred = $.Deferred();
        getDraftData(paymentId, paymentType, transferType, transferNow, getDraftDataDeferred);
        return getDraftDataDeferred;
      },
      getPurposeDesc: function() {

        getPurposeDescDeferred = $.Deferred();
        getPurposeDesc(getPurposeDescDeferred);
        return getPurposeDescDeferred;
      },
      getDeliveryMode: function() {

        getDeliveryModeDeferred = $.Deferred();
        getDeliveryMode(getDeliveryModeDeferred);
        return getDeliveryModeDeferred;
      },
      fetchCourierAddress: function(addressType) {
        fetchCourierAddressDeferred = $.Deferred();
        fetchCourierAddress(addressType, fetchCourierAddressDeferred);
        return fetchCourierAddressDeferred;
      },
      getBranchAddress: function(branchCode) {

        getBranchAddressDeferred = $.Deferred();
        getBranchAddress(branchCode, getBranchAddressDeferred);
        return getBranchAddressDeferred;
      }
    };
  };
  return new draftModel();
});