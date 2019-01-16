define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ServiceRequestsDetailModel = function() {
    var baseService = BaseService.getInstance();
    /**
     * In case more than one instance of model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf PreferenceFunctionsModel~PreferenceFunctionsModel
     */
    var
      approveRejectSRDeferred, approveRejectSR = function(srID, remarks, status, deferred) {
        var params = {
            status: status,
            remarks: remarks
          },
          options = {
            url: "servicerequest/" + srID + "?status={status}&note={remarks}",
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };
        baseService.patch(options, params);
      },
      fetchProductsDetailDeferred, fetchProductsDetail = function(srID, deferred) {

        var options = {
          url: "servicerequest/" + srID,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.fetch(options);
      },
      fetchBranchDetailDeferred, fetchBranchDetail = function(branchCode, deferred) {

        var options = {
          url: "locations/branches?branchCode=" + branchCode,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.fetch(options);
      };
    return {
      approveRejectSR: function(srID, remarks, status) {
        approveRejectSRDeferred = $.Deferred();
        approveRejectSR(srID, remarks, status, approveRejectSRDeferred);
        return approveRejectSRDeferred;
      },
      fetchProductsDetail: function(srID) {
        fetchProductsDetailDeferred = $.Deferred();
        fetchProductsDetail(srID, fetchProductsDetailDeferred);
        return fetchProductsDetailDeferred;
      },
      fetchBranchDetail: function(branchCode) {
        fetchBranchDetailDeferred = $.Deferred();
        fetchBranchDetail(branchCode, fetchBranchDetailDeferred);
        return fetchBranchDetailDeferred;

      }
    };
  };
  return new ServiceRequestsDetailModel();
});