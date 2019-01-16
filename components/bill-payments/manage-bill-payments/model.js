define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";
    var BillPaymentsModel = function () {
        var baseService = BaseService.getInstance();
        var fetchRegisteredBillersDeferred, fetchRegisteredBillers = function(deferred) {
          var options = {
            url: "registeredBillers",
            success: function(data) {
              deferred.resolve(data);
            }
          };
          baseService.fetch(options);
        },
        fetchBillerDetailsDeferred, fetchBillerDetails = function(billerRegistrationId, deferred) {
          var options = {
            url: "registeredBillers/{billerRegistrationId}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            billerRegistrationId: billerRegistrationId
          };
          baseService.fetch(options, params);
        },
        fetchBillerValuesDeferred, fetchBillerValues = function(billerId, deferred) {
            var options = {
              url: "billers/{billerId}",
              success: function(data) {
                deferred.resolve(data);
              }
            }, params = {
              billerId: billerId
            };
            baseService.fetch(options, params);
        },
        fetchBillersDeferred, fetchBillers = function(categoryId, locationId, deferred) {
            var options = {
              url: "billers?categoryId={categoryId}&operationalAreaId={operationalAreaId}",
              success: function(data) {
                deferred.resolve(data);
              }
            },params = {
              "categoryId": categoryId,
              "operationalAreaId": locationId
            };
            baseService.fetch(options, params);
        },
        fireBatchDeferred,fireBatch = function(deferred, subRequestList, type) {
          var options = {
            url: "batch",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
          baseService.batch(options, {type: type}, subRequestList);
        },
        fetchBillerLogosDeferred, fetchBillerLogos = function(billerId, deferred) {
            var options = {
              url: "billers/{billerId}",
              success: function(data) {
                deferred.resolve(data);
              }
            }, params = {
              billerId: billerId
            };
            baseService.fetch(options, params);
        },
        deleteBillerDeferred, deleteBiller = function(billerRegistrationId, deferred) {
          var options = {
            url: "registeredBillers/{billerRegistrationId}",
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          },
          params = {
            billerRegistrationId: billerRegistrationId
          };
          baseService.remove(options, params);
        };
        return {
            fetchRegisteredBillers: function() {
                fetchRegisteredBillersDeferred = $.Deferred();
                fetchRegisteredBillers(fetchRegisteredBillersDeferred);
                return fetchRegisteredBillersDeferred;
            },
            fetchBillerDetails: function(billerRegistrationId) {
                fetchBillerDetailsDeferred = $.Deferred();
                fetchBillerDetails(billerRegistrationId, fetchBillerDetailsDeferred);
                return fetchBillerDetailsDeferred;
            },
            fetchBillerValues: function(billerId) {
                fetchBillerValuesDeferred = $.Deferred();
                fetchBillerValues(billerId, fetchBillerValuesDeferred);
                return fetchBillerValuesDeferred;
            },
            fireBatch: function(subRequestList, type) {
                fireBatchDeferred = $.Deferred();
                fireBatch(fireBatchDeferred, subRequestList, type);
                return fireBatchDeferred;
            },
            fetchBillers: function(categoryId, locationId) {
                fetchBillersDeferred = $.Deferred();
                fetchBillers(categoryId, locationId, fetchBillersDeferred);
                return fetchBillersDeferred;
            },
            fetchBillerLogos: function(billerId) {
                fetchBillerLogosDeferred = $.Deferred();
                fetchBillerLogos(billerId, fetchBillerLogosDeferred);
                return fetchBillerLogosDeferred;
            },
            deleteBiller: function(billerRegistrationId) {
                deleteBillerDeferred = $.Deferred();
                deleteBiller(billerRegistrationId, deleteBillerDeferred);
                return deleteBillerDeferred;
            }
        };
    };
    return new BillPaymentsModel();
});
