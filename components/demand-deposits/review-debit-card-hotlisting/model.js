define([
  "jquery",
  "baseLogger",
  "baseService"
], function($, BaseLogger, BaseService) {
  "use strict";
  /**
   * Model for hotlist Card section
   *
   * @namespace HotlistCard~HotlistModel
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
   *@property {String} addressDetails.postalAddress.country -  To store the address country.
   *@property {String} addressDetails.postalAddress.zipcode -  To store the address zipcode.
   *@property {String} addressDetails.postalAddress.branch -  To store the address branch.
   *@property {String} addressDetails.modeofDelivery - To store the mode of delivery.
   *@property {String} addressDetails.addressType -  To store the type of address.
   *@property {String} addressDetails.postalAddress -  To store the postal address.
   *@property {String} replaceModel.address - To store the address details required for replacing the debit card including address line1 ,address line2,address line 3,address line4, city, state,country and zipcode
   *@property {Object} baseService -To store the baseService object
   *@property {Object} fetchDebitCardInfoDeferred -To store the deferred object
   *@property {Object} hotListModel -To store the payload for hotlisting the card including hotlistReason
   *@property {Object} replaceModel -To store the payload required for replacing the debit card
   *@property {Object} replaceModel.deliveryOption - To store the delivery option
   *@property {Object} addressDetails - To store the address details .
   */
  var HotlistModel = function() {
    var params, baseService = BaseService.getInstance(),
      /**
       * Model - description
       *
       * @return {type}  description
       */
      Model = function() {
        this.requestData = {
          label: ""
        };
        this.tempBlockDebitCardRequest = {
          requestType: "",
          requestData: "",
          entityTypeIdentifier: "",
          status: "",
          entityTypeIdentifierKey: "",
          priorityType: "",
          entityType: "",
          definition: {
            id: ""
          }
        };
        this.hotListModel = {
          statusType: "HTL",
          statusUpdateReason: {
            hotlistReason: ""
          },
          statusUpdateCardDetails: {
            embossingName: ""
          }
        };
        this.replaceModel = {
          address: {
            line1: 0,
            line2: "",
            line3: "",
            line4: "",
            city: "",
            state: "",
            country: "",
            zipCode: ""
          },
          deliveryOption: ""
        };
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
            zipCode: "",
            branch: "",
            branchName: ""
          }
        };
      },fetchHotlistReasonsDeferred,
    /**
     * fetchHotlistReasons - description
     *
     * @param  {type} deferred description
     * @return {type}          description
     */
    fetchHotlistReasons = function(deferred) {
      params = {};
      var options = {
        url: "enumerations/cardHotlistReasons",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options, params);
    },tempBlockRequestDeferred,
    /**
     * tempBlockRequest - description
     *
     * @param  {type} payload  description
     * @param  {type} deferred description
     * @return {type}          description
     */
    tempBlockRequest = function(payload, deferred) {
      var options = {
        url: "servicerequest",
        data: payload,

        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };
      baseService.add(options);
    },hotlistRequestDeferred,
    /**
     * hotlistRequest - description
     *
     * @param  {type} data     description
     * @param  {type} accid    description
     * @param  {type} cardId   description
     * @param  {type} deferred description
     * @return {type}          description
     */
    hotlistRequest = function(data, accid, cardId, deferred) {
      params = {
        "accID": accid,
        "cardID": cardId
      };
      var options = {
        url: "accounts/demandDeposit/{accID}/debitCards/{cardID}/hotlist",
        data: data,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };
      baseService.add(options, params);
    },createReplaceCardDeferred,
    /**
     * createReplaceCard - description
     *
     * @param  {type} payload   description
     * @param  {type} accountId description
     * @param  {type} cardNo    description
     * @param  {type} deferred  description
     * @return {type}           description
     */
    createReplaceCard = function(payload, accountId, cardNo, deferred) {
      params = {
        "accountId": accountId,
        "cardNo": cardNo
      };
      var options = {
        url: "accounts/demandDeposit/{accountId}/debitCards/{cardNo}/replace",
        data: payload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };
      baseService.add(options, params);
    };
    return {

      /**
       * fetchHotlistReasons - description
       *
       * @return {type}  description
       */
      fetchHotlistReasons: function() {
        fetchHotlistReasonsDeferred = $.Deferred();
        fetchHotlistReasons(fetchHotlistReasonsDeferred);
        return fetchHotlistReasonsDeferred;
      },

      /**
       * hotlistRequest - description
       *
       * @param  {type} data   description
       * @param  {type} accid  description
       * @param  {type} cardId description
       * @return {type}        description
       */
      hotlistRequest: function(data, accid, cardId) {
        hotlistRequestDeferred = $.Deferred();
        hotlistRequest(data, accid, cardId, hotlistRequestDeferred);
        return hotlistRequestDeferred;
      },

      /**
       * createReplaceCard - description
       *
       * @param  {type} payload   description
       * @param  {type} accountId description
       * @param  {type} cardNo    description
       * @return {type}           description
       */
      createReplaceCard: function(payload, accountId, cardNo) {
        createReplaceCardDeferred = $.Deferred();
        createReplaceCard(payload, accountId, cardNo, createReplaceCardDeferred);
        return createReplaceCardDeferred;
      },

      /**
       * tempBlockRequest - description
       *
       * @param  {type} payload description
       * @return {type}         description
       */
      tempBlockRequest: function(payload) {
        tempBlockRequestDeferred = $.Deferred();
        tempBlockRequest(payload, tempBlockRequestDeferred);
        return tempBlockRequestDeferred;
      },

      /**
       * getNewModel - description
       *
       * @return {type}  description
       */
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new HotlistModel();
});
