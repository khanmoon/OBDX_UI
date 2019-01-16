define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model file for Apply debit card section. This file contains the model definition
   * for Apply Debit Card section and exports the DebitCardApply model which can be used
   * as a component.
   *
   * @namespace DebitCardApply~DebitCardApplyModel
   * @class
   * @property {String} reason - To store the reason .
   * @property {String} deliveryOption -To store the delivery option .
   * @property {Object} addressDetails - Object containing the address details modeofDelivery,
   * @property {String} addressDetails.modeofDelivery -To store modeofDelivery,
   * @property {String} addressDetails.addressType -To store addressType.
   * @property {Object} address - Object containing the address details containing  address line1 ,address line2,address line3  ,address line4 ,country,state,city,zipcode
   * @property {Object} submitCardDetailsDeffered - To store the deffered object for submit card.
   * @property {Object} getReasonsDeffered - To store the deffered object for reasons being fetched.
   * @property {Object} postalAddress - Object containing the postal address details like address line1 ,address        line2,address line3  ,address line4  ,address line5,  address line6,  address line7,address line8,address          line9,address line10,address line11  ,address line12 ,   country,state,city,zipcode
   */
  var ApplyCardModel = function() {
    /**
     * In case more than one instance of model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model, Model2
     * @private
     * @memberOf ApplyCardModel~ApplyCardModel
     */
    var submitCardDetailsDeffered, getReasonsDeffered, Model = function() {
        this.name = "";
        this.address = {
          line1: 0,
          line2: "",
          line3: "",
          line4: "",
          city: "",
          state: "",
          country: "",
          zipCode: ""
        };
        this.reason = "";
        this.deliveryOption = "COR";
      },
      Model2 = function() {
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
            country: ""
          },
          city: null,
          country: null,
          branch: null
        };
      },
      baseService = BaseService.getInstance(),
      /**
      Get method to get the reasons for blocking card
      @deferred - returns deferred resolve or reject
      **/
      getReasons = function(deferred) {
        var options = {
          url: "enumerations/debitCardApplicationReason",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      /**
      POST method to submit the details of card
      @accountId - account id for particular account for which new debitcard is requested,
      @data - expected request payload to service
      @deferred - returns deferred resolve or reject
      **/
      submitCardDetails = function(accountId, data, deferred) {
        var options = {
          url: "accounts/demandDeposit/" + accountId + "/debitCards",
          data: data,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
      };
    return {
      submitCardDetails: function(accountId, data) {
        submitCardDetailsDeffered = $.Deferred();
        submitCardDetails(accountId, data, submitCardDetailsDeffered);
        return submitCardDetailsDeffered;
      },
      getNewModel: function() {
        return new Model();
      },
      getNewModelAddress: function() {
        return new Model2();
      },
      getReasons: function() {
        getReasonsDeffered = $.Deferred();
        getReasons(getReasonsDeffered);
        return getReasonsDeffered;
      }
    };
  };
  return new ApplyCardModel();
});