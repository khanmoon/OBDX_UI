define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var APIModel = function() {

    var Model = function() {
        return {
          creditAPIModel: {

            "transactionAmount": {
              "currency": "AUD",
              "amount": 50
            },
            "comments": "",
            "merchantId": "FLIPKART001",
            "externalReferenceNo": "FL120001300",
            "walletId": "9988776678",
            "walletIdentifier": "MOBILE",
            "walletDetail": "9988776678"

          },
          debitAPIModel: {
            "merchantId": "AMAZON001",
            "externalReferenceNo": "AMZ687787",
            "transactionAmount": {
              "currency": "AUD",
              "amount": 10
            },
            "comments": "",
            "walletIdentifier": "MOBILE",
            "walletDetail": "9988776678"
          },
          kycUpdateModel: {
            "dictionaryArray": null,
            "refLinks": null,
            "updatedWallets": [{
              "dictionaryArray": null,
              "refLinks": null,
              "walletId": null,
              "partyId": null,
              "salutation": null,
              "firstName": null,
              "lastName": null,
              "emailId": "asdff@iofds.sodis",
              "mobileNo": "1111111111",
              "accountOpeningDate": null,
              "availableBalance": null,
              "kycStatus": null,
              "kycComments": null,
              "createdBy": null,
              "creationDate": null,
              "lastUpdatedBy": null,
              "lastUpdatedDate": null,
              "version": 1,
              "dob": null,
              "gender": null
            }]
          }
        };
      },

      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      creditAPIDeferred,
      creditAPI = function(data, deferred) {
        var options = {
          url: "wallets/external/payin",
          data: data,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },

      debitAPIDeferred,
      debitAPI = function(data, deferred) {
        var options = {
          url: "wallets/external/payout",
          data: data,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },

      kycUpdateDeferred,
      kycUpdate = function(data, deferred) {
        var options = {
          url: "wallets/kyc/external",
          data: data,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.update(options);
      };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },

      creditAPI: function(data) {

        creditAPIDeferred = $.Deferred();
        creditAPI(data, creditAPIDeferred);
        return creditAPIDeferred;
      },
      debitAPI: function(data) {

        debitAPIDeferred = $.Deferred();
        debitAPI(data, debitAPIDeferred);
        return debitAPIDeferred;
      },
      kycUpdate: function(data) {

        kycUpdateDeferred = $.Deferred();
        kycUpdate(data, kycUpdateDeferred);
        return kycUpdateDeferred;
      }

    };
  };
  return new APIModel();
});
