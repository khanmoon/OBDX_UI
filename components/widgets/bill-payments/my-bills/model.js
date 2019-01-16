define(["jquery", "baseService", "framework/js/constants/constants"], function ($, BaseService, Constants) {
    "use strict";
    var DemandDepositAnalysisModel = function () {
        var baseService = BaseService.getInstance();
        var fetchBillersDeferred, fetchBillers = function (deferred) {
                var options = {
                    url: "registeredBillers",
                    success: function (data) {
                        deferred.resolve(data);
                    }
                };
                if (Constants.userSegment === "ADMIN") {
                    options.url = "design-dashboard/data/bill-payments/my-bills";
                    baseService.fetchJSON(options);
                } else {
                    baseService.fetch(options);
                }
            },
            fireBatchDeferred, fireBatch = function (deferred, subRequestList, type) {
                var options = {
                    url: "batch",
                    success: function (data) {
                        deferred.resolve(data);
                    },
                    error: function (data) {
                        deferred.reject(data);
                    }
                };
                baseService.batch(options, {
                    type: type
                }, subRequestList);
            },
            fetchBillerDetailsDeferred, fetchBillerDetails = function (billerRegistrationId, deferred) {
                var options = {
                        url: "registeredBillers/{billerRegistrationId}",
                        success: function (data) {
                            deferred.resolve(data);
                        }
                    },
                    params = {
                        billerRegistrationId: billerRegistrationId
                    };
                baseService.fetch(options, params);
            },
            fetchBillerValuesDeferred, fetchBillerValues = function (billerId, deferred) {
                var options = {
                        url: "billers/{billerId}",
                        success: function (data) {
                            deferred.resolve(data);
                        }
                    },
                    params = {
                        billerId: billerId
                    };
                baseService.fetch(options, params);
            };
        return {
            fetchBillers: function () {
                fetchBillersDeferred = $.Deferred();
                fetchBillers(fetchBillersDeferred);
                return fetchBillersDeferred;
            },
            fireBatch: function (subRequestList, type) {
                fireBatchDeferred = $.Deferred();
                fireBatch(fireBatchDeferred, subRequestList, type);
                return fireBatchDeferred;
            },
            fetchBillerDetails: function (billerRegistrationId) {
                fetchBillerDetailsDeferred = $.Deferred();
                fetchBillerDetails(billerRegistrationId, fetchBillerDetailsDeferred);
                return fetchBillerDetailsDeferred;
            },
            fetchBillerValues: function (billerId) {
                fetchBillerValuesDeferred = $.Deferred();
                fetchBillerValues(billerId, fetchBillerValuesDeferred);
                return fetchBillerValuesDeferred;
            }
        };
    };
    return new DemandDepositAnalysisModel();
});