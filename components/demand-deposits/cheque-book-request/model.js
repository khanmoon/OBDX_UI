define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model file for Product Requirements section. This file contains the model definition
   * for check book request  section and exports the ChequeBookRequest model which can be used
   * as a component.
   *
   * @namespace CheckBookRequest~CheckBookRequestModel
   * @class
   * @property {Object} chequeBookDetails - Object containing the Cheque Book details
   * @property {Object} addressDetails - Object containing the Address details
   * @property {Object} chequeBookType - Object containing the Cheque Book type details
   * @property {Object} chequeDeliveryDetailsDTO - Object containing the delivery address details
   * @property {Object} address - Object containing the delivery address details
   * @property {Object} postalAddress - Object containing the postal address details like address line1 ,address line2,address line3  ,address line4  ,address line5,  address line6,  address line7,address line8,address line9,address line10,address line11,address line12,   country,state,city,zipcode
   * @property {string} chequeBookDetails.noOfChequeLeaves - number of leaves required in a Cheque Book
   * @property {string} chequeBookDetails.noOfChequeBooks - number of cheque Books required by the user
   * @property {string} chequeBookDetails.noOfChequeLeaves - number of leaves required in a Cheque Book
   * @property {string} chequeBookDetails.currency - ISO currency code
   * @property {string} chequeBookDetails.noOfChequeLeaves - number of leaves required in a Cheque Book
   * @property {string} chequeBookDetails.deliveryOption - to store the options of delivery the user prefers for the checkbook delivery
   * @property {string} chequeBookType.stockCode        -for storing stockCode.
   * @property {string} chequeBookType.stockCurrency    -for storing stockCurrency.
   * @property {string} chequeBookType.stockDescription -for storing stockDescription.
   * @property {string} addressDetails.modeofDelivery   -for storing type of delivery.
   * @property {string} addressDetails.addressType      -for storing type of address.
   */
  var demandDepositChequeRequestModel = function() {
    var baseService = BaseService.getInstance(),
      /**
       * In case more than one instance of demandDepositChequeRequest model is required,
       * we are declaring model as a function, of which new instances can be created and
       * used when required.
       *
       * @class Model
       * @private
       * @memberOf demandDepositChequeRequestModel
       */
      Model = function() {
        return {
          chequeBookDetails: {
            "accountId": {
              value: null,
              displayValue: null
            },
            "noOfChequeLeaves": "",
            "noOfChequeBooks": "1",
            "personalizedTitle": "",
            "currency": "",
            "chequeBookTypeList": [{
              "stockCode": "",
              "stockCurrency": "",
              "stockDescription": ""
            }],
            "chequeDeliveryDetailsDTO": {
              "address": {
                "line1": "",
                "line2": "",
                "line3": "",
                "line4": "",
                "city": "",
                "state": "",
                "country": "",
                "zipCode": ""
              },
              "deliveryOption": "",
              "addressType": "",
              "branchCode": ""
            }
          },
          addressDetails: {
            modeofDelivery: null,
            addressType: null,
            addressTypeDescription: null,
            postalAddress: {
              line1: "",
              line2: "",
              line3: "",
              line4: "",
              line5: "",
              line6: "",
              line7: "",
              line8: "",
              line9: "",
              line10: "",
              line11: "",
              line12: "",
              city: "",
              state: "",
              country: "",
              zipCode: "",
              branch: "",
              branchName: ""
            }
          }
        };
      },
      fetchChequeBookTypeDeffered, requestChequeBookDeffered,
      /**
       * Function executes the "POST" request to for chequebook
       * @function requestChequeBook
       * @memberOf demandDepositChequeRequestModel
       * @param {accountId} - unique accountId
       * @param {payload} - expected data for service
       * @param {deferred} - resolved after successful execution or rejected after failure
       **/
      requestChequeBook = function(accountId, payload, deffered) {
        var options = {
          url: "accounts/demandDeposit/" + accountId + "/chequeBooks",
          data: payload,
          success: function(data, status, jqXhr) {
            deffered.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deffered.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      /**
       * Function executes the "GET" request to fetch chequebooktype
       * @function fetchChequeBookType
       * @memberOf demandDepositChequeRequestModel
       * @param {accountId} - unique accountId
       * @param {deferred} - resolved after successful execution or rejected after failure
       **/
      fetchChequeBookType = function(accountId, deffered) {
        var options = {
          url: "enumerations/chequeBookType",
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchChequeBookType: function(accountId) {
        fetchChequeBookTypeDeffered = $.Deferred();
        fetchChequeBookType(accountId, fetchChequeBookTypeDeffered);
        return fetchChequeBookTypeDeffered;
      },
      requestChequeBook: function(accountId, payload) {
        requestChequeBookDeffered = $.Deferred();
        requestChequeBook(accountId, payload, requestChequeBookDeffered);
        return requestChequeBookDeffered;
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new demandDepositChequeRequestModel();
});
