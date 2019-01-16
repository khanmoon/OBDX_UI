define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ServiceRequestsListModel = function() {
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
      fetchProductsDeferred, fetchProducts = function(partyId, payload, deferred) {
        var params = {
            "payload": payload,
            "partyId": partyId
          },
          options = {
            url: "workflows/products",
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };
        baseService.fetch(options, params);
      },
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
      };
    return {
      fetchProducts: function(partyId, payload) {
        fetchProductsDeferred = $.Deferred();
        fetchProducts(partyId, payload, fetchProductsDeferred);
        return fetchProductsDeferred;
      },
      approveRejectSR: function(srID, remarks, status) {
        approveRejectSRDeferred = $.Deferred();
        approveRejectSR(srID, remarks, status, approveRejectSRDeferred);
        return approveRejectSRDeferred;
      }
    };
  };
  return new ServiceRequestsListModel();
});