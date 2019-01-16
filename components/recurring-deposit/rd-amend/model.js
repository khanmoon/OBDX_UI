/**
 * Model for rd-amend
 * @param {object} BaseService base service instance for server communication
 * @return {object} recurringDepositModel Modal instance
 */
define([
    "baseService"
], function(BaseService) {
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
                this.amendModel = {
                    "rollOverType": "A",
                    "module": "RD",
                    "payoutInstructions": [{
                        "accountId": {
                            "displayValue": null,
                            "value": null
                        },
                        "account": null,
                        "branchId": null,
                        "id": null,
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
                        "clearingCode": null,
                        "networkType": null,
                        "payoutComponentType": "P"
                    }]
                };
            },
            baseService = BaseService.getInstance();
        return {
            /**
             * Method to get new modal instance
             * @returns {object}  Returns the modelData
             */
            getNewModel: function() {
                return new Model();
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
             * getPayOutOptionList - fetches payout options list
             *
             * @returns {Promise}  Returns the promise object
             */
            getPayOutOptionList: function() {
                return baseService.fetch({
                    url: "enumerations/payOutOption"
                });
            }
        };
    };
    return new recurringDepositModel();
});