define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ReIssueCardModel = function() {
    var baseService = BaseService.getInstance(),
      /**
       * var Model - description
       *
       * @return {type}  description
       */
      Model = function() {
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
      },
      createReplaceCardDeferred,

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
        var params = {
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
       * getNewModel - description
       *
       * @param  {type} modelData description
       * @return {type}           description
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
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
      }
    };
  };
  return new ReIssueCardModel();
});
