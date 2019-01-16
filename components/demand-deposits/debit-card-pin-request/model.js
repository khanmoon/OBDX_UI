define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for Debit Card Pin Request section
   *
   * @namespace RequestPin~RequestPinModel
   * @class
   *@property {String} addressDetails.postalAddress.line1 -  To store the address line1.
   *@property {String} addressDetails.postalAddress.line2 -  To store the address line2.
   *@property {String} addressDetails.postalAddress.line3 -  To store the address line3.
   *@property {String} addressDetails.postalAddress.line4 -  To store the address line4.
   *@property {String} addressDetails.postalAddress.line5 -  To store the address line5.
   *@property {String} addressDetails.postalAddress.line6 -  To store the address line6.
   *@property {String} addressDetails.postalAddress.line7 -  To store the address line7.
   *@property {String} addressDetails.postalAddress.line8 -  To store the address line8.
   *@property {String} addressDetails.postalAddress.line9 -  To store the address line9.
   *@property {String} addressDetails.postalAddress.line10 -  To store the address line10.
   *@property {String} addressDetails.postalAddress.line11 -  To store the address line11.
   *@property {String} addressDetails.postalAddress.line12 -  To store the address line12.
   *@property {String} addressDetails.postalAddress.city  -  To store the  city.
   *@property {String} addressDetails.postalAddress.state -  To store the state.
   *@property {String} addressDetails.postalAddress.country -  To store the address country.            *@property {String} addressDetails.postalAddress.zipcode -  To store the address zipcode.
   *@property {String} addressDetails.postalAddress.branch -  To store the address branch.
   *@property {String} addressDetails.modeofDelivery - To store the mode of delivery.
   *@property {String} addressDetails.addressType -  To store the type of address.
   *@property {String} addressDetails.postalAddress -  To store the postal address.
   *@property {String} payload.address - To store the address details required for replacing the debit card including address line1 ,address line2,address line 3,address line4, city,           state,country and zipcode
   *@property {String} payload.deliveryOption - To store the delivery option
   *@property {Object} baseService -To store the baseService object
   *@property {Object} payload - Object store the payload
   *@property {Object} requestPinDeferred - Object store the deferred object
   */
  var RequestPinModel = function() {
    var baseService = BaseService.getInstance(),
      /**
       * In case more than one instance of model is required,
       * we are declaring model as a function, of which new instances can be created and
       * used when required.
       *
       * @class Model
       * @private
       * @memberOf RequestPinModel~RequestPinModel
       */
      Model = function() {
        this.addressDetails = {
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
            branch: "",
            branchName: ""
          }
        };
        this.payload = {
          "address": {
            "line1": "",
            "line2": "",
            "line3": "",
            "line4": "",
            "city": "",
            "state": "",
            "country": ""
          },
          "deliveryOption": ""
        };
      },
      /**
			POST method to get the pin
			@accountId - account id for particular account for which pin is requested,
			@debitCardId - debit card information
			@payload - expected request payload to service
			@deferred - returns deferred resolve or reject
			**/
      requestPinDeferred, requestPin = function(accountId, debitCardId, payload, deferred) {
        var params = {
            "accountId": accountId,
            "debitCardId": debitCardId
          },
          options = {
            url: "accounts/demandDeposit/{accountId}/debitCards/{debitCardId}/pin",
            data: payload,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };
        baseService.add(options, params);
      };
    return {
      requestPin: function(accountId, debitCardId, payload) {
        requestPinDeferred = $.Deferred();
        requestPin(accountId, debitCardId, payload, requestPinDeferred);
        return requestPinDeferred;
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new RequestPinModel();
});