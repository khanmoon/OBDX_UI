define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";
    var internationalPayModel = function() {
        var baseService = BaseService.getInstance(),
            getPayoutDataDeferred, getPayoutData = function(paymentId, paymentType, transferType, transferNow, deferred) {
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
            };
        return {
            getPayoutData: function(paymentId, paymentType, transferType, date) {

                getPayoutDataDeferred = $.Deferred();
                getPayoutData(paymentId, paymentType, transferType, date, getPayoutDataDeferred);
                return getPayoutDataDeferred;
            },
            getBankDetailsBIC: function(code) {
                return baseService.fetch({
                    url: "financialInstitution/bicCodeDetails/{BICCode}"
                }, {
                    BICCode: code
                });
            },
            getBankDetailsNCC: function(code) {
                return baseService.fetch({
                    url: "financialInstitution/nationalClearingDetails/{nationalClearingCodeType}/{nationalClearingCode}"
                }, {
                    nationalClearingCodeType: "NCC",
                    nationalClearingCode: code
                });
            },
            getCharges: function() {
                return baseService.fetch({
                    url: "enumerations/correspondanceChargeType"
                });
            },
            /**
             * fetches service charges maintenances
             * @returns {Promise}  Returns the promise object
             */
            getChargesMaintenances: function() {
                return baseService.fetch({
                    url: "maintenances/payments"
                });
            },
            /**
             * fetches service charges
             * @returns {Promise}  Returns the promise object
             */
            getServiceCharges: function(params) {
                return baseService.fetch({
                    url: "charges?paymentType={paymentType}&transactionAmount={transactionAmount}&transactionCurrency={transactionCurrency}&debitAccountId={debitAccountId}"
                }, params);
            },
            /**
             * fetches forex deals list for the user
             *
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
    return new internationalPayModel();
});