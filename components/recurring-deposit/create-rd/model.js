/**
 * Model for create-rd
 * @param1 {object} jquery jquery instance
 * @param2 {object} BaseService base service instance for server communication
 * @return {object} recurringDepositModel Modal instance
 */
define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";
    var recurringDepositModel = function() {
        /**
         * In case more than one instance of recurringDepositModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        var Model = function() {
                this.createRDModel = {
                    "partyName": null,
                    "module": null,
                    "partyId": null,
                    "holdingPattern": null,
                    "productDTO": {
                        "productId": null,
                        "name": null,
                        "depositProductType" :null
                    },
                    "parties": [

                    ],
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
                        "days": "0",
                        "months": null,
                        "years": null
                    },
                    "payoutInstructions": [{
                        "accountId": {
                            "displayValue": null,
                            "value": null
                        },
                        "account": "",
                        "branchId": null,
                        "percentage": 100,
                        "type": null,
                        "beneficiaryName": null,
                        "bankName": null,
                        "address": {
                            "line1": null,
                            "line2": null,
                            "city": null,
                            "country": null
                        },
                        "networkType": null,
                        "clearingCode": null,
                        "payoutComponentType": "P"
                    }],
                    "payInInstruction": [{
                        "accountId": {
                            "displayValue": null,
                            "value": null
                        },
                        "branchId": null,
                        "percentage": 100
                    }],
                    "rollOverType": "A",
                    "rollOverAmount": {
                        "currency": null,
                        "amount": null
                    },
                    "nomineeDTO": null
                };
                this.addNomineeModel = {
                    accountId: {
                        displayValue: null,
                        value: null
                    },
                    accountType: null,
                    accountModule: "RD",
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
                };
            },
            baseService = BaseService.getInstance(),

            openRdDeferred,

            /**
             * Method to save the details of newly created Recurring Deposit
             * deferred object is resolved once the  information  is successfully fetched
             *
             * @function openRd
             * @param {object} data Payload to be passed to create RD
             * @param {boolean} isSimulated Flag to simulate and validate given request payload
             * @param {object} deferred - resolved for successful request
             * @memberOf recurringDepositModel
             * @returns {void}
             * @private
             */
            openRd = function(data, isSimulated, deferred) {
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
                baseService.add(options);
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

            /**
             * Method to get new modal instance
             * @returns {object}  Returns the modelData
             */
            getNewModel: function() {
                return new Model();
            },
            /**
             * fetchAccountData - fetches account listing
             *
             * @returns {Promise}  Returns the promise object
             */
            fetchAccountData: function() {
                return baseService.fetch({
                    url: "accounts/demandDeposit"
                });
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
             * fetchBranch -fetches branch details
             *
             * @param {String} clearingCodeType clearing code type of the code to be verified
             * @param {String} clearingCode clearing code to be verified
             * @returns {Promise}  Returns the promise object
             */
            fetchBranch: function(clearingCodeType, clearingCode) {
                return baseService.fetch({
                    url: "financialInstitution/domesticClearingDetails/" + clearingCodeType + "/" + clearingCode
                });
            },

            /**
             * getProductList - fetches product list
             *
             * @returns {Promise}  Returns the promise object
             */
            getProductList: function() {
                return baseService.fetch({
                    url: "products/deposit?productType=RD"
                });
            },

            /**
             * getProductList - fetches payout options list
             *
             * @returns {Promise}  Returns the promise object
             */
            getPayOutOptionList: function() {
                return baseService.fetch({
                    url: "enumerations/payOutOption"
                });
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
            },
            /**
             * calculateMaturityAmount - calculate maturity amount and date.
             * @param {object} createRDData payload to be passed to calculate maturity amount and date for RD
             * @returns {Promise}  Returns the promise object
             */
            calculateMaturityAmount: function(createRDData) {
                return baseService.add({
                    url: "accounts/deposit/maturityAmount",
                    data: createRDData
                });
            },
            /**
             * getrollOverTypeList - fetches rollover type list
             *
             * @returns {Promise}  Returns the promise object
             */
            getrollOverTypeList: function() {
                return baseService.fetch({
                    url: "enumerations/rollOverType"
                });
            },
            /**
             * Public function to create RD
             *
             * @param {object} data Payload to be passed to create RD
             * @param {boolean} isSimulated Flag to simulate and validate given request payload
             * @returns {Promise}  Returns the promise object
             */
            openRd: function(data, isSimulated) {
                openRdDeferred = $.Deferred();
                openRd(data, isSimulated, openRdDeferred);
                return openRdDeferred;
            }
        };
    };
    return new recurringDepositModel();
});