/**
 * Model for redeem-rd
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
        this.redeemRDModel = {
          "redemptionId": null,
          "partyId": null,
          "module": null,
          "accountId": {
            "displayValue": null,
            "value": null
          },
          "date": null,
          "maturityAmount": {
            "currency": null,
            "amount": null
          },
          "netCreditAmt": {
            "currency": null,
            "amount": null
          },
          "charges": {
            "currency": null,
            "amount": null
          },
          "redemptionAmount": {
            "currency": null,
            "amount": null
          },
          "revisedPrincipalAmount": {
            "currency": null,
            "amount": null
          },
          "revisedMaturityAmount": {
            "currency": null,
            "amount": null
          },
          "revisedInterestRate": 0,
          "typeRedemption": "F",
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
            "payoutComponentType": null
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
       * redeemDetails - It fetches Total redeemable amount,Penalty/charges,etc
       *
       * @param {string} accountId account id of selected account.
       * @param {object} data Payload to be passed to redeem RD
       * @returns {Promise}  Returns the promise object
       */
      redeemDetails: function(accountId, data) {
        return baseService.add({
          url: "accounts/deposit/" + accountId + "/penalities",
          data: data
        });
      }
    };
  };
  return new recurringDepositModel();
});
