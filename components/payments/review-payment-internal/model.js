define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";
    var internalTransferModel = function() {
        var baseService = BaseService.getInstance(),
            getTransferDataDeferred, getTransferData = function(paymentId, paymentType, transferType, transferNow, deferred) {
                var url;
                if (transferNow) {
                    url = "payments/" + paymentType + "/" + transferType + "/" + paymentId;
                } else {
                    url = "payments/instructions/" + paymentType + "/" + transferType + "/" + paymentId;
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
            getFrequencyDescDeferred, getFrequencyDesc = function(deferred) {
                var options = {
                    url: "enumerations/paymentFrequency",
                    success: function(data) {
                        deferred.resolve(data);
                    }
                };
                baseService.fetch(options);
            },
            getPurposeDescDeferred, getPurposeDesc = function(deferred) {
                var options = {
                    url: "purposes/PC",
                    success: function(data) {
                        deferred.resolve(data);
                    }
                };
                baseService.fetch(options);
            },
            fetchAccountsDescDeferred, fetchAccounts = function(taskCode, deferred) {
                var options = {
                    url: "accounts/demandDeposit?taskCode=" + taskCode,
                    success: function(data) {
                        deferred.resolve(data);
                    }
                };
                baseService.fetch(options);
            };
        return {
            getTransferData: function(paymentId, paymentType, transferType, date) {

                getTransferDataDeferred = $.Deferred();
                getTransferData(paymentId, paymentType, transferType, date, getTransferDataDeferred);
                return getTransferDataDeferred;
            },
            getFrequencyDesc: function() {

                getFrequencyDescDeferred = $.Deferred();
                getFrequencyDesc(getFrequencyDescDeferred);
                return getFrequencyDescDeferred;
            },
            getPurposeDesc: function() {

                getPurposeDescDeferred = $.Deferred();
                getPurposeDesc(getPurposeDescDeferred);
                return getPurposeDescDeferred;
            },
            fetchAccounts: function(taskCode) {

                fetchAccountsDescDeferred = $.Deferred();
                fetchAccounts(taskCode, fetchAccountsDescDeferred);
                return fetchAccountsDescDeferred;
            },
            /**
             * fetches forex deals list for the user

             * @param {String} dealId contains selected currency for filter
             * @returns {Promise}  Returns the promise object
             */
            fetchForexDealList: function(dealId) {

                return baseService.fetch({
                    url: "forexDeals?dealId={dealId}"
                }, {
                    dealId: dealId
                });

            }
        };
    };
    return new internalTransferModel();
});