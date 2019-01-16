define([
    "jquery",
    "baseService",
    "framework/js/constants/constants-payments"
], function($, BaseService) {
    "use strict";
    var ReviewAdhocPaymentModel = function() {
        var baseService = BaseService.getInstance(),
            readAdhocPaymentDeferred, readAdhocPayment = function(paymentId, deferred) {
                var options = {
                    url: "payments/generic/" + paymentId,
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };
                baseService.fetch(options);
            },
            getTransferPurposeDeferred, getPurpose = function(paymentType, deferred) {
                var url;
                if (paymentType === "INTERNALFT" || paymentType === "INTERNALFT_PAYLATER") {
                    url = "purposes/linkages?taskCode=PC_F_INTRNL";
                } else if (paymentType === "INDIADOMESTICFT" || paymentType === "INDIADOMESTICFT_PAYLATER" || paymentType === "UKPAYMENTS" || paymentType === "UKPAYMENTS_PAYLATER" || paymentType === "SEPACREDITTRANSFER" || paymentType === "SEPACARDPAYMENT" || paymentType === "SEPACREDITTRANSFER_PAYLATER" || paymentType === "SEPACARDPAYMENT_PAYLATER") {
                    url = "purposes/linkages?taskCode=PC_F_DOM";
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
            getChargesDeferred, getCharges = function(deferred) {
                var options = {
                    url: "enumerations/correspondanceChargeType",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.resolve(data);
                    }
                };
                baseService.fetch(options);
            },
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
            };
        return {
            readAdhocPayment: function(paymentId) {
                readAdhocPaymentDeferred = $.Deferred();
                readAdhocPayment(paymentId, readAdhocPaymentDeferred);
                return readAdhocPaymentDeferred;
            },
            getTransferPurpose: function(paymentType) {
                getTransferPurposeDeferred = $.Deferred();
                getPurpose(paymentType, getTransferPurposeDeferred);
                return getTransferPurposeDeferred;
            },
            getBranches: function() {
                getBranchesDeferred = $.Deferred();
                getBranches(getBranchesDeferred);
                return getBranchesDeferred;
            },
            getCharges: function() {
                getChargesDeferred = $.Deferred();
                getCharges(getChargesDeferred);
                return getChargesDeferred;
            },
            /**
             * fetches service charges maintenances
             * @returns {Promise}  Returns the promise object
             */
            getChargesMaintenances : function(){
                return baseService.fetch({
                    url : "maintenances/payments"
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
    return new ReviewAdhocPaymentModel();
});