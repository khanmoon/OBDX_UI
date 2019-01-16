define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var AddOndModel = function() {
    var params, baseService = BaseService.getInstance();
    var fetchLimitDeferred,
      /**
       * Function executes the "GET" method to fetch the limits of given credit card
       * @function getLimits
       * @memberOf AddOndModel
       * @param {creditCardId} -  Credit card to be used as the parameter
       * @param {deferred} - resolved after successful execution or rejected after failure
       **/
      getLimits = function(creditCardId, deferred) {
        params = {
          "creditCardId": creditCardId
        };
        var options = {
          url: "accounts/cards/credit/{creditCardId}/limit",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      addCardDeferred,
      /**
       * Function executes the "POST" method to add a new Add on Credit Card
       * @function addCard
       * @memberOf AddOndModel
       * @param {model} - Model with the required data
       * @param {creditCardId} - Credit card to be used as the parameter
       * @param {deferred} - resolved after successful execution or rejected after failure
       **/
      addCard = function(model, creditCardId, deferred) {
        params = {
          "creditCardId": creditCardId
        };
        var options = {
          url: "accounts/cards/credit/{creditCardId}/supplementary",
          data: model,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
        baseService.add(options, params);
      },
      getRelationshipListDeferred, getRelationshipList = function(deferred) {
        var options = {
          url: "enumerations/relationshipType",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchLimit: function(creditCardId) {
        fetchLimitDeferred = $.Deferred();
        getLimits(creditCardId, fetchLimitDeferred);
        return fetchLimitDeferred;
      },
      addCard: function(model, creditCardId) {
        addCardDeferred = $.Deferred();
        addCard(model, creditCardId, addCardDeferred);
        return addCardDeferred;
      },
      getRelationshipList: function() {
        getRelationshipListDeferred = $.Deferred();
        getRelationshipList(getRelationshipListDeferred);
        return getRelationshipListDeferred;
      }
    };
  };
  return new AddOndModel();
});