define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";
    var DomesticPayoutModel = function() {
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
                    },
                    error: function(data) {
                        deferred.resolve(data);
                    }
                };
                baseService.fetch(options);
            };
        return {
            getTransferData: function(paymentId, paymentType, transferType, transferNow) {
                getTransferDataDeferred = $.Deferred();
                getTransferData(paymentId, paymentType, transferType, transferNow, getTransferDataDeferred);
                return getTransferDataDeferred;
            },
            getPurpose: function() {
                return baseService.fetch({
                    url: "purposes/PC"
                });
            },
            getBankDetailsDCC: function(code) {
                return baseService.fetch({
                    url: "financialInstitution/domesticClearingDetails/{domesticClearingCodeType}/{domesticClearingCode}"
                }, {
                    domesticClearingCodeType: "INDIA",
                    domesticClearingCode: code
                });
            },
            getBankDetails: function(code) {
                return baseService.fetch({
                    url: "financialInstitution/bicCodeDetails/{BICCode}"
                }, {
                    BICCode: code
                });
            },
            getBankDetailsNCC: function(region, code) {
                return baseService.fetch({
                    url: "financialInstitution/nationalClearingDetails/{nationalClearingCodeType}/{nationalClearingCode}"
                }, {
                    nationalClearingCodeType: region,
                    nationalClearingCode: code
                });
            },
            getFrequencyDesc: function() {
                getFrequencyDescDeferred = $.Deferred();
                getFrequencyDesc(getFrequencyDescDeferred);
                return getFrequencyDescDeferred;
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
            getCharges: function() {
                return baseService.fetch({
                    url: "enumerations/correspondanceChargeType"
                });
            },
            /**
             * fetches service charges
             * @returns {Promise}  Returns the promise object
             */
            getServiceCharges: function(params) {
                return baseService.fetch({
                    url: "charges?paymentType={paymentType}&transactionAmount={transactionAmount}&transactionCurrency={transactionCurrency}&debitAccountId={debitAccountId}&networkType={network}"
                }, params);
            }
        };
    };
    return new DomesticPayoutModel();
});