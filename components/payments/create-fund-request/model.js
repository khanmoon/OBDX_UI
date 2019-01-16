define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var createFundRequestModel = function() {
    var baseService = BaseService.getInstance();
    var Model = function() {
      this.payDetails = {
        title: null,
        status: null,
        requestee: null,
        totalAmount: {
          currency: null,
          amount: null
        },
        collections: []
      };
      this.computeDetails = {
        name: null,
        amount: null,
        percentage: null
      };
      this.fundCollectionDetails = {
        status: null,
        amount: {
          currency: null,
          amount: null
        },
        recipient: null,
        message: null
      };
    };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      postFundRequest: function(payload) {
        var options = {
          url: "fundRequests",
          data: payload
        };
        return baseService.add(options);
      }
    };
  };
  return new createFundRequestModel();
});
