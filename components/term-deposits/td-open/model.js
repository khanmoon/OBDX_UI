define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";
    var openTdModel = function() {
        var self = this;
        self.transactionId = null;
        self.transactionVersionId = null;
        var Model = function(transactionId, transactionVersionId) {
            return {
                transactionId: transactionId,
                transactionVersionId: transactionVersionId,
                createTDData: {
                    "partyName": null,
                    "module": null,
                    "partyId": null,
                    "holdingPattern": "SINGLE",
                    "productDTO": {
                        "productId": null,
                        "name": null,
                        "depositProductType": "TD"
                    },
                    "parties": [],
                    "maturityAmount": {
                        "currency": null,
                        "amount": null
                    },
                    "maturityDate": null,
                    "interestRate": null,
                    "principalAmount": {
                        "currency": null,
                        "amount": null
                    },
                    "tenure": {
                        "days": null,
                        "months": null,
                        "years": null
                    },
                    "payoutInstructions": [{
                        "accountId": {
                            "displayValue": null,
                            "value": null
                        },
                        "account": null,
                        "branchId": null,
                        "percentage": 100,
                        "type": null,
                        "beneficiaryName": null,
                        "bankName": null,
                        "address": {
                            line1: null,
                            line2: null,
                            city: null,
                            country: null
                        },
                        "networkType": null,
                        "clearingCode": null,
                        "payoutComponentType": null
                    }],
                    "payInInstruction": [{
                        "accountId": {
                            "displayValue": "",
                            "value": ""
                        },
                        "branchId": null,
                        "percentage": 100
                    }],
                    "rollOverType": null,
                    "rollOverAmount": {
                        "currency": null,
                        "amount": null
                    },
                    "nomineeDTO": null
                },
                addNomineeModel: {
                    accountId: {
                        displayValue: null,
                        value: null
                    },
                    accountType: null,
                    accountModule: null,
                    dateOfBirth: null,
                    name: null,
                    relation: null,
                    minor: false,
                    address: {
                        country: null,
                        state: null,
                        city: null,
                        zipCode: null,
                        line1: null,
                        line2: null
                    }
                }
            };
        };
        var baseService = BaseService.getInstance();
        var getDepositTypeDeferred, getDepositType = function(deferred) {
                var options = {
                    url: "products/deposit?productType=TD",
                    success: function(data) {
                        deferred.resolve(data);
                    }
                };
                baseService.fetch(options);
            },
            openTdDeferred, openTd = function(data, isSimulated, deferred) {
                var options = {
                    url: "accounts/deposit",
                    data: data,
                    success: function(data, status, jqXhr) {
                        deferred.resolve(data, status, jqXhr);
                    }
                };
                options.headers = {};
                if (isSimulated) {
                    options.headers["X-Validate-Only"] = "Y";
                }
                if (self.transactionId) {
                    options.headers["X-Transaction-ID"] = self.transactionId + "#" + self.transactionVersionId;
                }
                baseService.add(options);
            },
            fetchMaturityInstructionDeferred, fetchMaturityInstruction = function(deferred) {
                var options = {
                    url: "enumerations/rollOverType",
                    success: function(data) {
                        deferred.resolve(data);
                    }
                };
                baseService.fetch(options);
            },
            calculateMaturityAmountDeferred, calculateMaturityAmount = function(createTDData, deferred) {
                var options = {
                    url: "accounts/deposit/maturityAmount",
                    data: createTDData,
                    success: function(data) {
                        deferred.resolve(data);
                    }
                };
                baseService.add(options);
            },
            fetchPartyDetailsDeferred, fetchPartyDetails = function(deferred) {
                var options = {
                    url: "me/party",
                    success: function(data) {
                        deferred.resolve(data);
                    }
                };
                baseService.fetch(options);
            },
            readInterestRateDeferred,

            /**
             * readInterestRate - description
             *
             * @param  {type} deferred  description
             * @param  {type} productId description
             * @param  {type} moduleType description
             * @return {type}           description
             */
            readInterestRate = function(deferred, productId, moduleType) {
                var params = {
                        productId: productId,
                        moduleType: moduleType
                    },
                    options = {
                        url: "products/deposit/{productId}/interestRates?accountModule={moduleType}",
                        success: function(data) {
                            deferred.resolve(data);
                        }
                    };
                baseService.fetch(options, params);
            },

            fetchLinkedPartyDetailsDeferred, fetchLinkedPartyDetails = function(deferred) {
                var options = {
                    url: "me/party/relations",
                    success: function(data) {
                        deferred.resolve(data);
                    }
                };
                baseService.fetch(options);
            },
            confirmAddNomineeDeferred,
            /**
             * Add nominee
             * @function confirmAddNominee
             * @param {string} payload  An string containg the data to be sent to host
             * @param {string} deferred  An string containg the data to be recieved from host
             * @returns {Promise}  Returns the promise object
             * @memberOf recurringDepositModel
             */
            confirmAddNominee = function(payload, deferred) {
                var options = {
                    url: "nominee",
                    data: payload,
                    success: function(data, status, jqXHR) {
                        deferred.resolve(data, status, jqXHR);
                    }
                };
                baseService.add(options);
            };
        return {
            getDepositType: function() {
                getDepositTypeDeferred = $.Deferred();
                getDepositType(getDepositTypeDeferred);
                return getDepositTypeDeferred;
            },
            openTd: function(data, isSimulated) {
                openTdDeferred = $.Deferred();
                openTd(data, isSimulated, openTdDeferred);
                return openTdDeferred;
            },
            fetchMaturityInstruction: function() {
                fetchMaturityInstructionDeferred = $.Deferred();
                fetchMaturityInstruction(fetchMaturityInstructionDeferred);
                return fetchMaturityInstructionDeferred;
            },
            calculateMaturityAmount: function(createTDData) {
                calculateMaturityAmountDeferred = $.Deferred();
                calculateMaturityAmount(createTDData, calculateMaturityAmountDeferred);
                return calculateMaturityAmountDeferred;
            },
            fetchPartyDetails: function() {
                fetchPartyDetailsDeferred = $.Deferred();
                fetchPartyDetails(fetchPartyDetailsDeferred);
                return fetchPartyDetailsDeferred;
            },
            getNewModel: function(transactionId, transactionVersionId) {
                return new Model(transactionId, transactionVersionId);
            },
            fetchLinkedPartyDetails: function() {
                fetchLinkedPartyDetailsDeferred = $.Deferred();
                fetchLinkedPartyDetails(fetchLinkedPartyDetailsDeferred);
                return fetchLinkedPartyDetailsDeferred;
            },
            /**
             * Public function to create nominee at the time of rd creation
             *
             * @param {object} payload Payload to be passed to create RD
             * @returns {Promise}  Returns the promise object
             */
            confirmAddNominee: function(payload) {
                confirmAddNomineeDeferred = $.Deferred();
                confirmAddNominee(payload, confirmAddNomineeDeferred);
                return confirmAddNomineeDeferred;
            },

            /**
             * readInterestRate - function to fetch interest Rates for given productId
             *
             * @param  {type} productId productId to be passed to TD
             * @param  {type} moduleType description
             * @return {type}           description
             */
            readInterestRate: function(productId, moduleType) {
                readInterestRateDeferred = $.Deferred();
                readInterestRate(readInterestRateDeferred, productId, moduleType);
                return readInterestRateDeferred;
            },
            /**
             * fetches currentDate
             *
             * @returns {Promise}  Returns the promise object
             */
            getHostDate: function() {
                return baseService.fetch({
                    url: "payments/currentDate"
                });
            }
        };
    };
    return new openTdModel();
});
